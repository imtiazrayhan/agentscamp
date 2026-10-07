---
description: "Create a deterministic inventory of an approved handoff directory: record relative file paths, byte lengths, and SHA-256 hashes with code, list skipped symlinks and unreadable files, and write a snapshot without interpreting project status or changing source files."
title: "Snapshot Handoff"
date: "2026-10-06"
reviewed: "2026-10-06"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers", "analysts"]
tags: ["snapshot-handoff", "knowledge-work"]
featured: false
related: ["guide:ai-project-handoff", "agent:project-handoff-auditor", "glossary:data-lineage"]
seoDescription: "Create a handoff file inventory with paths, byte lengths, and SHA-256 hashes, recording unreadable files and symlinks without changing source files."
argument-hint: "<source-directory> <snapshot.md>"
allowed-tools: "Read, Bash, Write"
---

Inventory the approved directory named in `$ARGUMENTS`: `<source-directory> <snapshot.md>`. Record relative paths, byte lengths, and SHA-256 hashes without interpreting project status. The output must be new and outside the resolved source directory.

## Safe argument execution

Treat `$ARGUMENTS` as literal data. Properly JSON-encode its exact text as a string in a new temporary `args.json`. Save the Python block as temporary `check.py`; keep both outside input scope. Run `python3` with those paths as separate safely quoted arguments. Never expand or concatenate `$ARGUMENTS` into a shell command. The script validates arity and parses quoted paths with `shlex.split`, without shell evaluation. Requires Python 3.10+; no packages.

Hidden files/directories, symlinks, and nonregular files are excluded and recorded. Keep the approved scope; do not read symlink destinations or include source contents. List unreadable files and directory-walk errors. A read failure produces an **incomplete** snapshot and exit 2; an invalid scope/output or execution error exits 1. No report or source is overwritten.

This is a byte observation of readable regular files, not a locked filesystem snapshot. Use a stable directory; detected changes during hashing become read failures. UTC time records the observation, not source approval.

```python
import hashlib, json, os, shlex, stat, sys
from datetime import datetime, timezone
from pathlib import Path


def arguments():
    if len(sys.argv) != 2:
        raise ValueError('Pass one JSON argument-envelope path')
    raw = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    if not isinstance(raw, str):
        raise ValueError('Argument envelope must be a JSON string')
    args = shlex.split(raw)
    if len(args) != 2:
        raise ValueError('Expected <source-directory> <snapshot.md>')
    return args


def snapshot_handoff(directory):
    root = Path(directory).expanduser().resolve(strict=True)
    if not root.is_dir():
        raise ValueError('Source must be a directory')
    files, skipped, errors = [], [], []

    def walk_error(error):
        name = Path(error.filename) if error.filename else root
        relative = str(name.relative_to(root)) if name.is_relative_to(root) else '.'
        errors.append({'path': relative, 'error': str(error)})

    for current, dirs, names in os.walk(root, followlinks=False, onerror=walk_error):
        current = Path(current)
        kept = []
        for name in sorted(dirs):
            path = current / name
            relative = str(path.relative_to(root))
            if path.is_symlink():
                skipped.append({'path': relative, 'reason': 'symlink'})
            elif name.startswith('.'):
                skipped.append({'path': relative, 'reason': 'hidden directory'})
            else:
                kept.append(name)
        dirs[:] = kept
        for name in sorted(names):
            path = current / name
            relative = str(path.relative_to(root))
            if path.is_symlink() or name.startswith('.'):
                skipped.append({'path': relative,
                    'reason': 'symlink' if path.is_symlink() else 'hidden file'})
                continue
            try:
                if not stat.S_ISREG(path.lstat().st_mode):
                    skipped.append({'path': relative, 'reason': 'nonregular file'})
                    continue
                flags = os.O_RDONLY | getattr(os, 'O_NOFOLLOW', 0) | getattr(os, 'O_NONBLOCK', 0)
                fd = os.open(path, flags)
                with os.fdopen(fd, 'rb') as handle:
                    before = os.fstat(handle.fileno())
                    if not stat.S_ISREG(before.st_mode):
                        raise OSError('File ceased to be regular')
                    digest, size = hashlib.sha256(), 0
                    while chunk := handle.read(65536):
                        size += len(chunk)
                        digest.update(chunk)
                    after = os.fstat(handle.fileno())
                    if (before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns):
                        raise OSError('File changed during hashing; rerun in stable scope')
                files.append({'path': relative, 'bytes': size, 'sha256': digest.hexdigest()})
            except OSError as error:
                errors.append({'path': relative, 'error': str(error)})
    skipped.sort(key=lambda row: row['path'])
    errors.sort(key=lambda row: row['path'])
    return {'root': str(root), 'generated_utc': datetime.now(timezone.utc).isoformat(),
        'hash_algorithm': 'SHA-256', 'exclusions': ['symlinks', 'hidden paths', 'nonregular files'],
        'files': sorted(files, key=lambda row: row['path']), 'skipped': skipped,
        'errors': errors, 'listed_files': len(files), 'read_failures': len(errors),
        'skipped_symlinks': sum(row['reason'] == 'symlink' for row in skipped),
        'complete': not errors}


def render(result):
    state = 'COMPLETE for recorded scope' if result['complete'] else 'INCOMPLETE: read failures'
    return ('# Handoff byte snapshot\n\n' + state
        + '\n\nThis records byte observations, not project readiness or content accuracy.'
        + ' Hidden paths and symlinks are excluded. Paths in files/skipped/errors are'
        + ' source-relative references.\n\n' + chr(96) * 3 + 'json\n'
        + json.dumps(result, indent=2, ensure_ascii=False) + '\n' + chr(96) * 3 + '\n')


def main():
    source, requested = arguments()
    root = Path(source).expanduser().resolve(strict=True)
    candidate = Path(requested).expanduser()
    if candidate.is_symlink():
        raise ValueError('Snapshot output must not be a symlink')
    output = candidate.resolve()
    if output == root or root in output.parents:
        raise ValueError('Snapshot output must be outside the source directory')
    if output in {Path(__file__).resolve(), Path(sys.argv[1]).resolve()}:
        raise ValueError('Snapshot must not overwrite its runner or arguments')
    # Reject an existing report before reading the source.
    if output.exists():
        raise ValueError('Snapshot output already exists; choose a new path')
    result = snapshot_handoff(root)
    with output.open('x', encoding='utf-8') as handle:
        handle.write(render(result))
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result['complete'] else 2


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, OSError, UnicodeError) as error:
        print('ERROR: ' + str(error), file=sys.stderr)
        raise SystemExit(1)
```

Illustrative fixture: `brief.md` contains bytes `alpha
`; `assets/banner.txt` contains `beta
`; `.private` is excluded; `outside-link` points outside the scope. Expect exactly two readable files with lengths 6 and 5, one skipped symlink, and the hidden-file exclusion. Independently check hashes, outside-file absence, and unchanged source bytes.

Finish with approved root, observation time, hash algorithm, listed-file/read-failure/symlink counts, output path, and any incomplete-state warning from the script. Report source-relative references exactly as emitted. Do not turn an inventory into a readiness score, owner decision, completion claim, or proof that the packet's content is accurate.

Further reading: [handoff workflow](/guides/workflow/ai-project-handoff), [handoff auditor](/agents/product/project-handoff-auditor), and [data lineage](/glossary/data-lineage).
