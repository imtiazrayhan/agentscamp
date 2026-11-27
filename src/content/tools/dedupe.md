---
name: Dedupe
title: Dedupe
description: "dedupe is an open-source Python library that finds duplicate records and links datasets, learning its matching rules from pairs you label as it asks."
date: '2026-08-10'
updated: '2026-11-27'
reviewed: '2026-11-27'
topics:
- ai-at-work
- workflow-prompting
audience:
- analysts
- developers
- ai-engineers
tags:
- entity-resolution
- deduplication
- record-linkage
- python
- active-learning
featured: false
related:
- guide:link-records-across-datasets
- guide:ai-duplicate-record-review
- glossary:blocking-record-matching
- tool:tamr
summary: "dedupe is an MIT-licensed Python library from DataMade for fuzzy matching, deduplication and record linkage on structured data. You describe the fields, label a few dozen pairs it picks through active learning, and it learns field weights and blocking rules, then clusters matching records. It runs on a laptop; the hosted Dedupe.io service shut down in 2023."
url: https://docs.dedupe.io/
pricing: open-source
category: data
alternativeTo: ["tamr"]
repo: https://github.com/dedupeio/dedupe
license: MIT
os:
- macOS
- Windows
- Linux
color: orange
faq:
- q: "Is dedupe still maintained?"
  a: "It is in slow maintenance. As of November 2026, the latest release on PyPI is 3.0.3, uploaded in August 2024, and the GitHub repository's last push was in July 2025. The repository is not archived and has about 4,500 stars. The hosted Dedupe.io product built on the library was shut down on January 31, 2023."
- q: "How much training data does dedupe need?"
  a: "None up front. dedupe uses active learning: it shows you the record pairs it is least sure about and you answer yes, no or unsure in the console. You can save the labels to a JSON file and reuse them. The docs default to sampling 1,500 candidate pairs, and you stop labeling when you judge you have covered enough matches and non-matches."
- q: "Can dedupe link two different datasets?"
  a: "Yes. The Dedupe class finds duplicates inside one dataset, RecordLink joins two datasets that each have no internal duplicates, and Gazetteer matches messy records against a clean canonical list. Each has a Static version that loads saved settings so you can skip training on later runs."
- q: "How large a dataset can dedupe handle?"
  a: "The project says it runs on a laptop, but the convenience methods partition and join are documented as suitable only for small to moderately sized data. Clustering is done in memory, and the docs say the only fix when that runs out is fewer records. Larger jobs mean generating candidate pairs yourself and passing them to score()."
---

[dedupe](https://docs.dedupe.io/) is a Python library for the problem of deciding which rows refer to the same real-world thing: two customer records with a misspelled surname, a venue listed under three addresses, a donor entered once with a middle initial and once without. It was written by Forest Gregg and Derek Eder at DataMade, is MIT-licensed, and lives at [dedupeio/dedupe](https://github.com/dedupeio/dedupe) on GitHub.

## Highlights

- **Learns from your labels.** You do not write match rules. dedupe shows you pairs, you mark each as a match or distinct, and it fits a regularized logistic regression that turns field-by-field distances into a match probability.
- **Active learning.** It picks the pairs it is least certain about, so each answer you give teaches the model as much as possible.
- **Learned blocking.** Comparing every record with every other is too slow, so dedupe learns a small set of blocking rules that group likely matches. Rules are built from predicates such as "first three characters of the field" or "every word in the field", plus index predicates that cost more memory. See [blocking](/glossary/blocking-record-matching) for the concept and [dedupe's own explanation](https://docs.dedupe.io/en/latest/how-it-works/Making-smart-comparisons.html).
- **Clustering, not only pairs.** Pair scores are grouped into entities using hierarchical clustering with centroid linkage, and each record gets a confidence score for its cluster.
- **Typed fields.** Variable types include `String`, `ShortString`, `Text`, `Exact`, `Categorical`, `Price`, `LatLong`, `Set`, `Exists`, `Interaction` and `Custom`, with optional add-on packages for dates, addresses and names.
- **Three matching modes.** `Dedupe` for one dataset, `RecordLink` for joining two, and `Gazetteer` for matching against a canonical list.
- **Reusable settings.** Training labels save to JSON and the learned model to a settings file, which the `Static` classes load without retraining.

## In an AI-assisted workflow

Install it from PyPI:

```bash
pip install dedupe
```

A minimal deduplication run, using the API from the [3.0 documentation](https://docs.dedupe.io/en/latest/). Records are a dictionary keyed by your own record ID, and empty values should be `None`:

```python
import csv
import dedupe

# venues.csv is your own file with id, name, address and phone columns
with open("venues.csv") as f:
    data = {
        row["id"]: {k: (v.strip().lower() or None) for k, v in row.items() if k != "id"}
        for row in csv.DictReader(f)
    }

variables = [
    dedupe.variables.String("name"),
    dedupe.variables.String("address"),
    dedupe.variables.String("phone", has_missing=True),
]

deduper = dedupe.Dedupe(variables)
deduper.prepare_training(data)
dedupe.console_label(deduper)   # answer y / n / u, then f to finish
deduper.train()

with open("training.json", "w") as f:
    deduper.write_training(f)
with open("learned_settings", "wb") as f:
    deduper.write_settings(f)

for record_ids, scores in deduper.partition(data, threshold=0.5):
    print(record_ids, scores)
```

`partition` returns one tuple per cluster: the record IDs it believes are the same entity, and a confidence score for each. Lowering `threshold` raises recall and raising it raises precision.

Keep your source keys through the whole run, and treat the clusters as candidates for review, not as merges. The [guide to linking records across datasets](/guides/analytics/link-records-across-datasets) covers how to keep provenance, measure what blocking never compared, and hold out known pairs for evaluation, and the [duplicate record review guide](/guides/analytics/ai-duplicate-record-review) covers the human review step. An assistant such as Claude Code is useful for writing the loading and normalization code around dedupe; the labeling decisions should stay with someone who knows the data.

## Good to know

Maintenance status matters here. As of November 2026, the latest PyPI release is 3.0.3 from August 2024, the repository's last push was in July 2025, and the published wheels cover Python 3.8 through 3.13. The repository has about 4,500 stars as of November 2026 and is not archived, but this is a stable, slow-moving project, not an active one. The commercial Dedupe.io web service that DataMade built on the library was shut down on January 31, 2023, so there is no hosted version or paid support.

Scale is the other limit. The docs say `partition` and `join` should only be used on small to moderately sized datasets. Building index predicates and clustering both happen in memory; setting `index_predicates=False` in `train()` cuts memory and time at some cost in recall, and beyond that you generate candidate pairs yourself and call `score()`. A learned model is also only as good as the labeled pairs, so a rare kind of duplicate you never labeled may never be blocked together.

Among open-source alternatives, Splink, published under the moj-analytical-services organisation on GitHub, is MIT-licensed and takes a different approach: a probabilistic linkage model that runs in Python on DuckDB or on backends such as Spark, which its README pitches at 100 million records or more, with unsupervised training that needs no labeled pairs. Zingg is an AGPL-3.0 project aimed at entity resolution at scale. Both repositories were being updated as of November 2026. [Tamr](/tools/tamr) is the enterprise route: a commercial data mastering platform, for organizations that want a managed product instead of a library. Choose dedupe when the data fits on one machine, you are comfortable in Python, and you can spend an hour labeling pairs.
