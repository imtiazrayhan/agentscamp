---
term: "VLM (Vision-Language Model)"
description: "A VLM jointly understands images and text — reading documents, screenshots, charts, and photos and reasoning about them in language."
date: 2026-06-11
topics: ["mlops-ai-infra"]
tags: ["vlm", "vision", "multimodal", "ocr"]
related: ["vlm-ocr-documents", "multimodal-ai", "multimodal-document-extractor", "qwen3-vl", "computer-use"]
faq:
  - q: "Do VLMs replace OCR?"
    a: "For most document understanding, effectively yes. Classic OCR outputs characters and leaves structure to you; a VLM reads the page like a person — tables, layout, handwriting, checkboxes, the figure the text refers to — and can return structured data directly. Dedicated OCR still wins on raw character accuracy for clean, high-volume scanning at minimal cost."
  - q: "What are VLMs' weak spots?"
    a: "Precise counting and measurement, dense small text at low resolution, exact spatial coordinates, and hallucinated detail when an image is ambiguous — the model fills gaps plausibly, like any LLM. Resolution settings matter more than people expect: token cost scales with image size, and downscaling silently destroys small text."
---

**A vision-language model (VLM) is a model that takes images alongside text and reasons over both — describing a photo, extracting a table from a scanned invoice, reading a dashboard screenshot, or explaining a chart.**

Architecturally, a vision encoder turns images into tokens the language model attends to natively, so the LLM's reasoning applies directly to visual content. That collapsed what used to be pipelines: OCR + layout analysis + parsing became one call to a model that *reads the page* — the shift covered in [Using VLMs for OCR, Documents, and Video](/guides/vision/vlm-ocr-documents), and packaged for extraction work in the [multimodal-document-extractor](/skills/data/multimodal-document-extractor) skill.

Frontier APIs are all VLMs now, and open-weight families like [Qwen3-VL](/tools/qwen3-vl) brought the capability to self-hosting. Beyond documents, VLMs are the perception layer of [computer-use agents](/glossary/computer-use) (reading UIs to act on them) and of coding agents verifying their own frontend work from screenshots. The practical craft: manage image resolution deliberately — it's both the accuracy ceiling for small text and the token bill.
