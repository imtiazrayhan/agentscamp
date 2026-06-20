---
title: "Multimodal Embeddings and Image Search"
description: "How multimodal embeddings put images and text in one vector space, and how to build text-to-image and image-to-image search on top of it."
author: "AgentsCamp"
date: 2026-06-20
color: "cyan"
topics: ["multimodal-ai", "rag-retrieval"]
tags: ["multimodal-embeddings", "image-search", "clip", "vector-search", "retrieval"]
featured: false
summary: "Multimodal embeddings map images and text into one shared vector space, so a text query can rank images by meaning and an image can find similar images. Pick a model (CLIP/SigLIP lineage, or modern API models like Voyage and Cohere), embed your images at ingest, store vectors in a vector DB, and search by nearest neighbor. Watch for the modality gap and domain shift."
keyTakeaways:
  - "A shared embedding space means an image and a text caption that mean the same thing land near each other — so one cosine-similarity search handles text-to-image and image-to-image."
  - "The lineage is CLIP and SigLIP; in 2026 the strongest off-the-shelf options are API models like Voyage and Cohere (single vector for text, images, and full document pages) plus open models like SigLIP 2 and Jina CLIP."
  - "Same recipe as text RAG: embed at ingest, store vectors in a vector DB, query with the same model, return nearest neighbors. The only change is what you embed."
  - "The modality gap is real: image and text vectors cluster in separate cones, so an image-to-image hit usually scores higher than the best text-to-image hit. Tune thresholds per query type."
  - "Domain shift is the top failure mode. A general model trained on web photos underperforms on X-rays, satellite tiles, or product catalogs — evaluate on your data before trusting it."
  - "When images are mostly text or fine print (charts, dense documents, screenshots of tables), a VLM caption-then-embed pipeline often beats raw image embeddings."
faq:
  - q: "What is a shared embedding space for images and text?"
    a: "It's a single vector space where a model places both images and text, trained so that an image and a matching description land near each other. Because they share coordinates, you can compare across types: a text query ranks images, or an image finds similar images, all with one nearest-neighbor search."
  - q: "Which multimodal embedding model should I use in 2026?"
    a: "For a managed API with strong document and image handling, start with Voyage or Cohere's multimodal models — both embed text, images, and whole pages into one vector. If you need to self-host or fine-tune, use the SigLIP 2 or Jina CLIP families. Always benchmark on your own corpus first."
  - q: "Do I need a vector database for image search?"
    a: "For anything beyond a few thousand images, yes. You store one vector per image and run approximate nearest-neighbor search at query time. A managed option like Pinecone or pgvector on Postgres both work — the index doesn't care that the vectors came from images."
  - q: "When should I caption images with a VLM instead of embedding them directly?"
    a: "When the meaning lives in text inside the image — charts with labeled values, dense tables, screenshots, forms, or fine print. A vision-language model transcribes or describes the content, and you embed that text. Raw image embeddings capture overall appearance, not the exact numbers or words on the page."
  - q: "Why do image-to-image searches score higher than text-to-image?"
    a: "Because of the modality gap: contrastively trained models push all image vectors into one region of the space and all text vectors into another. Cross-modal similarities are systematically lower than within-modal ones. It's expected — set separate score thresholds for text queries versus image queries rather than one global cutoff."
related:
  - "how-embeddings-work"
  - "choosing-embeddings-2026"
  - "best-vector-database-2026"
  - "voyage-ai"
  - "cohere-rerank"
  - "pinecone"
---

A **multimodal embedding model maps images and text into the same vector space**, trained so that a photo and a sentence describing it land close together. Once your images live in that space, search is just nearest-neighbor lookup: type "red running shoes on a beach" and the closest image vectors come back ranked by meaning, not by filename or tags. Feed it an image instead of text, and you get visually similar images. Same index, same math — only the query type changes.

This is the same machinery as text [retrieval-augmented generation](/guides/concepts/how-embeddings-work), extended so that one model speaks both pictures and words. If you've built text RAG, you already know 80% of this. The new 20% is the part that bites: choosing a model that actually works on *your* images, and understanding why cross-modal scores behave the way they do.

## What a shared embedding space actually means

A single-modality text model only knows how to place text. A multimodal model is trained on huge sets of image–caption pairs with a **contrastive objective**: pull each image toward its true caption and push it away from all the others. After enough pairs, semantically matching images and texts converge to nearby points on the same unit sphere.

That shared geometry is the whole trick. Because an image of a golden retriever and the words "a happy dog" end up near each other, you can:

- **Text → image search:** embed the query string, return the nearest image vectors.
- **Image → image search:** embed the query image, return visually/semantically similar images.
- **Mixed search:** embed an interleaved image-plus-text query against the same index.

No captions to maintain, no keyword tagging, no separate pipelines per direction.

## The model lineage: CLIP, SigLIP, and the 2026 options

The idea goes back to **CLIP** (OpenAI, 2021), which proved that contrastive image–text training produces a useful shared space for zero-shot classification and retrieval. **SigLIP** refined the training loss (a sigmoid loss instead of softmax over the batch), and **SigLIP 2** (Google, 2025) added multilingual training, captioning-based pretraining, and self-distillation — it's the go-to open CLIP-style encoder now and a common drop-in wherever a vision-language encoder is needed.

For most teams in 2026, the better starting point is a **managed multimodal embedding API**, because document-heavy retrieval has moved well past raw photo matching:

- **[Voyage AI](/tools/voyage-ai)** — the `voyage-multimodal` family embeds interleaved text and images, including screenshots of PDFs, slides, tables, and figures, into a single vector. The 2026 generation adds video-frame support and Matryoshka (truncatable) dimensions.
- **Cohere Embed v4** — also vectorizes text, images, and mixed documents into one space, with multilingual support, long context, and Matryoshka dimensions. Available on Cohere, Bedrock, and Azure.

If you need to self-host, fine-tune, or avoid per-call costs, reach for the open families — **SigLIP 2**, **Jina CLIP v2**, or **Nomic Embed Vision**. They're CLIP-lineage, run on your own GPUs, and are fine-tunable on a domain corpus.

The durable selection advice is the same as for text models: dimensionality, language coverage, max image resolution, and cost-per-item matter, but **none of it substitutes for benchmarking on your own data**. See [choosing an embedding model in 2026](/guides/concepts/choosing-embeddings-2026) for the framework — it applies to multimodal too.

## Building the search: embed, store, query

The pipeline is deliberately boring, which is good.

1. **Embed at ingest.** Run every image through the model once and store the vector alongside an ID and metadata (source URL, dimensions, tags, timestamp). With an API model, batch the calls; with an open model, run it on a GPU.
2. **Store the vectors in a vector DB.** One vector per image is the default. The index doesn't know or care that these came from pixels — it just does approximate nearest-neighbor (ANN) search. Use a managed store like [Pinecone](/tools/pinecone) or pgvector on Postgres; the [best vector database in 2026](/guides/database/best-vector-database-2026) guide compares the trade-offs.
3. **Query with the *same* model.** This is non-negotiable. A text query embedded by a different model than the one that embedded your images lives in a different space, and similarity scores become meaningless. One model, both sides.
4. **Return nearest neighbors,** then optionally filter on metadata (date, category, license) and paginate.

One refinement worth knowing: cross-encoder **rerankers can sharpen the top results** after ANN retrieval, the same way they do in text RAG. [Cohere Rerank](/tools/cohere-rerank) and similar models re-score a candidate set for relevance; if your downstream uses retrieved text (e.g., captions or OCR), reranking the shortlist measurably improves precision.

## Evaluation and the pitfalls that bite

Plenty of image-search demos look great and fail in production. Three reasons dominate.

**The modality gap.** Contrastively trained models don't actually interleave images and text uniformly — they cluster all image vectors into one cone of the space and all text vectors into another, mostly non-overlapping cone. The practical consequence: **image-to-image similarities are systematically higher than text-to-image similarities** for equally relevant results. A score of 0.4 might be an excellent text→image match while 0.7 is a mediocre image→image one. Don't use a single global similarity threshold across query types — calibrate separate cutoffs, and judge by ranking quality, not raw score.

**Domain shift.** General models are trained on web images and captions. Point one at chest X-rays, satellite imagery, semiconductor wafers, or your specific product catalog and recall can collapse, because the visual distribution and vocabulary are nothing like the training data. This is the single most common cause of "it worked in the demo, it's bad on our data." The fix is to **evaluate on a labeled slice of your real corpus first** — build a small set of query→correct-result pairs and measure recall@k and MRR before you commit. Severe shift is the signal to fine-tune an open model or switch providers.

**Modality mismatch in content.** Image embeddings capture overall *appearance*, not the *text printed inside* an image. A model will happily tell you two invoices look alike while being useless at "find the invoice for $4,210.55." If the meaning your users search for is words or numbers on the page, raw image embeddings are the wrong tool.

## When to caption-then-embed with a VLM instead

For text-dense visuals — charts with labeled values, dense tables, forms, screenshots, scanned documents — a **VLM caption-then-embed pipeline often beats direct image embeddings**. At ingest, a vision-language model transcribes or describes each image (OCR plus a structured description of what the chart/table shows), and you embed *that text* with a normal text model. Now an exact-number or exact-phrase query can hit, because the relevant content is in the text space where text queries live — and you sidestep the modality gap entirely.

The trade-offs are real: captioning costs a VLM call per image at ingest, it can hallucinate or miss detail, and you lose pure visual similarity (two charts that *look* alike but say different things won't match). A common production pattern is **hybrid**: store both the image embedding and an embedded caption, and route or fuse based on the query. Visual-similarity queries hit the image vectors; factual lookups hit the caption vectors.

Rule of thumb: **embed the pixels when the answer is in the picture's appearance; caption-then-embed when the answer is in text inside the picture.** Start with whichever matches the majority of your queries, measure, and add the other path only if your eval set says you need it.
