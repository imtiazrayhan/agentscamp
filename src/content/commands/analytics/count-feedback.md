---
description: "Count a single-label feedback CSV with code: validate record IDs, collapse exact duplicate rows, reject conflicting rows for one ID, and report records, distinct known respondents, missing identities, and label totals without inventing prevalence."
title: "Count Feedback"
date: "2026-10-06"
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "analysts"]
tags: ["count-feedback", "knowledge-work"]
featured: false
related: ["guide:analyze-customer-feedback-with-ai", "skill:feedback-codebook-designer", "glossary:thematic-analysis"]
seoDescription: "Count labeled customer feedback with code, showing duplicate records, distinct respondents, missing identities, untagged rows, and counts per label."
argument-hint: "<feedback.csv> [output.md]"
allowed-tools: "Read, Write, Bash(python3 *)"
summary: "Count Feedback totals a labeled customer-feedback CSV with code instead of model arithmetic. It collapses exact duplicate rows, stops if one record ID carries two different labels, and reports records and distinct known respondents per label, plus untagged rows and rows with no respondent ID. It does not assign labels or compute prevalence."
---

## What it checks and when to run it

Run this as the last step of a feedback analysis, after every comment has been given one reviewed label and before you write up which themes are biggest. Language models miscount long lists, and "12 mentions" can mean 12 customers or one customer writing 12 times. This command does the counting in Python and keeps the two apart: records per label and distinct known respondents per label.

It expects a CSV with one row per feedback record and exactly these columns:

```csv
record_id,respondent_id,label
```

The [feedback analysis workflow](/guides/workflow/analyze-customer-feedback-with-ai) produces reviewed assignments with a record ID, a customer ID and a code; export those three fields under the column names above. [Feedback Codebook Designer](/skills/product/feedback-codebook-designer) defines the labels beforehand. A fixture with literal expected output follows the code.

Count the reviewed, single-label feedback CSV named in `$ARGUMENTS`: `<feedback.csv> [output.md]`. This command performs arithmetic and structural checks in code. It does not classify text or decide product priorities.

CSV columns must be exactly `record_id,respondent_id,label`, each appearing once; order may vary. Cells are trimmed at their outer edges. Require nonblank record IDs; keep blank identities unknown and blank labels untagged. Each label cell is one label, including punctuation; do not split or reinterpret it. Identical normalized triples collapse to one canonical record. Conflicting triples for one ID stop the run with no valid aggregates.

## Safe argument execution

Treat `$ARGUMENTS` as literal data. Properly JSON-encode its exact text as a string in a new temporary `args.json`. Save the Python block as temporary `check.py`; keep both outside input scope. Run `python3` with those paths as separate safely quoted arguments. Never expand or concatenate `$ARGUMENTS` into a shell command. The script validates arity and parses quoted paths with `shlex.split`, without shell evaluation. Requires Python 3.10+; no packages.

The optional Markdown report uses exclusive creation and cannot replace an input. Without an output path, use the JSON printed by the code to report counts. Validation errors exit 1 with a named error; never manufacture a partial count after failure.

```python
import csv, json, shlex, sys
from pathlib import Path


def arguments():
    if len(sys.argv) != 2:
        raise ValueError('Pass one JSON argument-envelope path')
    raw = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    if not isinstance(raw, str):
        raise ValueError('Argument envelope must be a JSON string')
    args = shlex.split(raw)
    if len(args) not in (1, 2):
        raise ValueError('Expected <feedback.csv> [output.md]')
    return args


def rows(path):
    columns = ['record_id', 'respondent_id', 'label']
    with path.open(newline='', encoding='utf-8-sig') as handle:
        reader = csv.reader(handle, strict=True)
        header = next(reader, [])
        if len(header) != len(columns) or set(header) != set(columns):
            raise ValueError('Expected exactly these columns: ' + ','.join(columns))
        data = []
        for cells in reader:
            line = reader.line_num
            if len(cells) != len(header):
                raise ValueError(f'Malformed CSV width at line {line}')
            data.append((line, dict(zip(header, (cell.strip() for cell in cells)))))
        return data


def count_feedback(path):
    raw = rows(path)
    canonical, duplicates, conflicts = {}, 0, set()
    for line, row in raw:
        rid = row['record_id']
        if not rid:
            raise ValueError(f'Missing record_id at line {line}')
        triple = (rid, row['respondent_id'], row['label'])
        if rid in canonical:
            if canonical[rid] != triple:
                conflicts.add(rid)
            else:
                duplicates += 1
        else:
            canonical[rid] = triple
    if conflicts:
        raise ValueError('Conflicting record_id(s): ' + ', '.join(sorted(conflicts))
                         + '; no valid aggregates')
    values = list(canonical.values())
    labels = {}
    for label in sorted({row[2] for row in values if row[2]}):
        selected = [row for row in values if row[2] == label]
        labels[label] = {'records': len(selected),
            'known_respondents': len({row[1] for row in selected if row[1]}),
            'unknown_identity_records': sum(not row[1] for row in selected)}
    return {'raw_rows': len(raw), 'exact_duplicates': duplicates,
        'canonical_records': len(values),
        'known_respondents': len({row[1] for row in values if row[1]}),
        'missing_identity_records': sum(not row[1] for row in values),
        'tagged': sum(bool(row[2]) for row in values),
        'untagged': sum(not row[2] for row in values), 'labels': labels}


def report_path(value, inputs):
    candidate = Path(value).expanduser()
    if candidate.is_symlink():
        raise ValueError('Report path must not be a symlink')
    output = candidate.resolve()
    if output in inputs:
        raise ValueError('Report must not overwrite an input')
    return output


def render(result, source):
    return ('# Feedback count\n\nInput: ' + json.dumps(str(source))
        + '\n\nCounts use trimmed cells and canonical record IDs. Blank identities'
        + ' remain unknown; no customer-prevalence denominator is assumed.\n\n'
        + chr(96) * 3 + 'json\n' + json.dumps(result, indent=2, ensure_ascii=False)
        + '\n' + chr(96) * 3 + '\n')


def main():
    args = arguments()
    source = Path(args[0]).expanduser().resolve(strict=True)
    if not source.is_file():
        raise ValueError('Feedback input must be a local file')
    output = report_path(args[1], {source, Path(__file__).resolve(),
                         Path(sys.argv[1]).resolve()}) if len(args) == 2 else None
    result = count_feedback(source)
    if output:
        with output.open('x', encoding='utf-8') as handle:
            handle.write(render(result, source))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, OSError, csv.Error, UnicodeError) as error:
        print('ERROR: ' + str(error), file=sys.stderr)
        raise SystemExit(1)
```

## Illustrative fixture

Invented rows: F1 appears twice, respondent A filed two different records, F4 is untagged and F5 has no respondent ID.

```csv
record_id,respondent_id,label
F1,A,export-failure
F1,A,export-failure
F2,A,export-failure
F3,B,export-failure
F4,C,
F5,,chart-latency
```

Expected stdout JSON (exit 0):

```json
{
  "raw_rows": 6,
  "exact_duplicates": 1,
  "canonical_records": 5,
  "known_respondents": 3,
  "missing_identity_records": 1,
  "tagged": 4,
  "untagged": 1,
  "labels": {
    "chart-latency": {
      "records": 1,
      "known_respondents": 0,
      "unknown_identity_records": 1
    },
    "export-failure": {
      "records": 3,
      "known_respondents": 2,
      "unknown_identity_records": 0
    }
  }
}
```

Export-failure has 3 records but only 2 known respondents. Adding a row `F2,A,discoverability` must stop the run with `ERROR: Conflicting record_id(s): F2; no valid aggregates` and exit 1.

Finish with the actual counts, normalization/duplicate policy, report path if written, and any error. Keep record counts distinct from respondent counts. Do not calculate prevalence or describe these as a percentage of customers.

Further reading: [feedback workflow](/guides/workflow/analyze-customer-feedback-with-ai), [codebook design](/skills/product/feedback-codebook-designer), and [thematic analysis](/glossary/thematic-analysis).
