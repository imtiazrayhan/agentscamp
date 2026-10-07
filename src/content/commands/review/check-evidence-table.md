---
description: "Check a study evidence CSV against a source registry with code: validate required columns and cells, row IDs, source references, duplicate study/outcome/time-point keys, and allowed status values, then report structural errors without judging research claims."
title: "Check Evidence Table"
date: "2026-10-06"
reviewed: "2026-10-06"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["analysts", "founders"]
tags: ["check-evidence-table", "knowledge-work"]
featured: false
related: ["guide:ai-literature-review-workflow", "skill:research-evidence-extractor", "agent:literature-screening-reviewer", "glossary:evidence-synthesis"]
seoDescription: "Check an evidence table with code for missing fields, duplicate study keys, invalid statuses, and unknown sources before reviewing research claims."
argument-hint: "<evidence.csv> <sources.json> [report.md]"
allowed-tools: "Read, Bash, Write"
---

Check the files named in `$ARGUMENTS`: `<evidence.csv> <sources.json> [report.md]`. This command validates structure and local references with code; it does not decide whether paper text supports a research claim.

Require each CSV column once: `row_id,study_id,source_id,location,outcome,value,unit,timepoint,status`. Order may vary. Trim outer cell whitespace. Every field except value/unit must be nonblank. Those two may be blank only for `missing` or `unresolved`; the other allowed status is `supported`. Check unique row IDs and unique `(study_id,outcome,timepoint)` keys. Repeated study IDs at different outcomes/time points are legal.

Registry objects have unique `source_id` values and directory-relative `path` values resolving to readable UTF-8 files inside that directory. Reject URLs and escaped scope; keep sources unchanged.

## Safe argument execution

Treat `$ARGUMENTS` as literal data. Properly JSON-encode its exact text as a string in a new temporary `args.json`. Save the Python block as temporary `check.py`; keep both outside input scope. Run `python3` with those paths as separate safely quoted arguments. Never expand or concatenate `$ARGUMENTS` into a shell command. The script validates arity and parses quoted paths with `shlex.split`, without shell evaluation. Requires Python 3.10+; no packages.

The optional report is a new Markdown file; it cannot overwrite CSV, registry, or registered sources. Exit 0 means structural checks passed, 2 means reported structural errors, and 1 means invalid input/execution. Physical CSV ending-line numbers locate records, including quoted multiline cells.

```python
import csv, json, shlex, sys
from collections import defaultdict
from pathlib import Path

COLUMNS = ['row_id', 'study_id', 'source_id', 'location', 'outcome',
           'value', 'unit', 'timepoint', 'status']


def arguments():
    if len(sys.argv) != 2:
        raise ValueError('Pass one JSON argument-envelope path')
    raw = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    if not isinstance(raw, str):
        raise ValueError('Argument envelope must be a JSON string')
    args = shlex.split(raw)
    if len(args) not in (2, 3):
        raise ValueError('Expected <evidence.csv> <sources.json> [report.md]')
    return args


def rows(path):
    with path.open(newline='', encoding='utf-8-sig') as handle:
        reader = csv.reader(handle, strict=True)
        header = next(reader, [])
        if len(header) != len(COLUMNS) or set(header) != set(COLUMNS):
            raise ValueError('Expected exactly these columns: ' + ','.join(COLUMNS))
        data = []
        for cells in reader:
            if len(cells) != len(header):
                raise ValueError(f'Malformed CSV width at line {reader.line_num}')
            data.append((reader.line_num, dict(zip(header, (cell.strip() for cell in cells)))))
        return data


def check_evidence(csv_path, registry_path):
    data = rows(csv_path)
    registry = json.loads(registry_path.read_text(encoding='utf-8'))
    if not isinstance(registry, list):
        raise ValueError('Source registry must be an array of source_id/path objects')
    sources, issues = {}, []
    for index, source in enumerate(registry, 1):
        if not isinstance(source, dict) or not all(
            isinstance(source.get(key), str) for key in ('source_id', 'path')):
            raise ValueError(f'Invalid registry object {index}')
        sid, value = source['source_id'].strip(), source['path'].strip()
        if not sid or sid in sources or not value:
            raise ValueError(f'Missing or duplicate registry ID/path at item {index}: {sid}')
        path = (registry_path.parent / value).resolve()
        sources[sid] = path
        try:
            if Path(value).is_absolute() or '://' in value or registry_path.parent not in path.parents:
                raise ValueError('Path must stay inside the registry directory')
            if not path.is_file():
                raise ValueError('Source is not a local regular file')
            # Verify readable UTF-8 text without interpreting or printing its contents.
            with path.open(encoding='utf-8-sig') as handle:
                while handle.read(65536):
                    pass
        except (ValueError, OSError, UnicodeError) as error:
            issues.append({'check': 'source-path', 'level': 'error',
                'registry_item': index, 'source_id': sid, 'reason': str(error)})
    row_ids, study_keys = defaultdict(list), defaultdict(list)
    required = set(COLUMNS) - {'value', 'unit'}
    for line, row in data:
        rid = row['row_id']
        for key in sorted(required):
            if not row[key]:
                issues.append({'check': 'missing-' + key, 'level': 'error',
                    'line': line, 'row_id': rid})
        if row['status'] not in {'supported', 'missing', 'unresolved'}:
            issues.append({'check': 'invalid-status', 'level': 'error', 'line': line, 'row_id': rid})
        if row['status'] not in {'missing', 'unresolved'} and (not row['value'] or not row['unit']):
            issues.append({'check': 'value-unit-required', 'level': 'error', 'line': line, 'row_id': rid})
        if row['source_id'] not in sources:
            issues.append({'check': 'unknown-source', 'level': 'error', 'line': line, 'row_id': rid})
        row_ids[rid].append((line, rid))
        study_keys[(row['study_id'], row['outcome'], row['timepoint'])].append((line, rid))
    for check, mapping in [('duplicate-row-id', row_ids), ('duplicate-study-key', study_keys)]:
        for key, entries in sorted(mapping.items()):
            if len(entries) > 1:
                issues.append({'check': check, 'level': 'error', 'key': key,
                    'line': min(line for line, _ in entries),
                    'lines': [line for line, _ in entries], 'row_ids': [rid for _, rid in entries]})
    issues.sort(key=lambda issue: (issue.get('line', 0), issue['check'], issue.get('source_id', '')))
    return {'rows': len(data), 'sources': len(sources), 'errors': len(issues), 'issues': issues,
        'scope': 'Structure and readable local references only; source meaning not verified'}, set(sources.values())


def render(result, csv_path, registry_path):
    state = 'FAIL: structural errors' if result['errors'] else 'PASS: structural checks only'
    return ('# Evidence table check\n\n' + state + '\n\nInputs: '
        + json.dumps([str(csv_path), str(registry_path)])
        + '\n\nCSV lines are physical ending-line numbers for each record. A nonblank'
        + ' locator is not proof that the source supports a finding. This does not'
        + ' establish evidence accuracy or search completeness.\n\n' + chr(96) * 3 + 'json\n'
        + json.dumps(result, indent=2, ensure_ascii=False) + '\n' + chr(96) * 3 + '\n')


def main():
    args = arguments()
    csv_path, registry_path = (Path(value).expanduser().resolve(strict=True) for value in args[:2])
    result, sources = check_evidence(csv_path, registry_path)
    if len(args) == 3:
        candidate = Path(args[2]).expanduser()
        if candidate.is_symlink():
            raise ValueError('Report path must not be a symlink')
        output = candidate.resolve()
        inputs = {csv_path, registry_path, Path(__file__).resolve(), Path(sys.argv[1]).resolve()} | sources
        if output in inputs:
            raise ValueError('Report must not overwrite an input or registered source')
        with output.open('x', encoding='utf-8') as handle:
            handle.write(render(result, csv_path, registry_path))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 2 if result['errors'] else 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, OSError, csv.Error, UnicodeError) as error:
        print('ERROR: ' + str(error), file=sys.stderr)
        raise SystemExit(1)
```

Illustrative fixture: E1/E2 repeat S1/completion/day7; E3 references unknown R9 with missing status; E4 has blank location. With registered readable R1/R2, expect duplicate-study-key, unknown-source, and missing-location respectively. Unique row IDs must not trigger duplicate-row-id.

Finish with actual row/source counts, line-numbered issues and affected IDs, report path, and structural pass/fail. A nonblank location is merely a locator: neither an error-free table nor readable source files establish evidence accuracy or complete literature coverage.

Further reading: [review workflow](/guides/workflow/ai-literature-review-workflow), [evidence extraction](/skills/data/research-evidence-extractor), [screening reviewer](/agents/analytics/literature-screening-reviewer), and [evidence synthesis](/glossary/evidence-synthesis).
