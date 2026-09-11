---
name: "Mistral OCR"
title: "Mistral OCR"
description: "Mistral AI's hosted OCR and document-understanding API: PDFs, Office files and images in, per-page Markdown and structured JSON out, billed per page."
seoTitle: "Mistral OCR: API, Pricing, Self-Hosting, and Alternatives"
url: "https://docs.mistral.ai/studio-api/document-processing/basic_ocr"
date: "2026-09-11"
pricing: "paid"
category: "platform"
repo: "https://github.com/mistralai/client-python"
os: ["Web"]
color: "purple"
topics: ["rag-retrieval", "llm-app-dev"]
audience: ["ai-engineers", "analysts"]
tags: ["ocr", "document-parsing", "pdf", "rag", "mistral"]
featured: false
sameAs:
  - "https://docs.mistral.ai/models/ocr-4-1"
  - "https://mistral.ai/news/ocr-4/"
  - "https://github.com/mistralai"
alternativeTo: ["llamaparse", "reducto", "docling", "marker"]
related: ["tool:llamaparse", "tool:reducto", "tool:docling", "guide:best-document-parsers-for-rag-2026", "guide:vlm-ocr-documents", "skill:multimodal-document-extractor"]
summary: "Mistral OCR is Mistral AI's proprietary, pay-per-page OCR API: it turns PDFs, Office documents and images into per-page Markdown plus JSON with tables, bounding boxes and confidence scores. The current model is OCR 4.1 (mistral-ocr-4-1), generally available since August 31, 2026. The weights are not open, and self-hosting is enterprise-only."
faq:
  - q: "Which Mistral OCR model ID should I use?"
    a: "Pin mistral-ocr-4-1, the OCR 4.1 model Mistral made generally available on August 31, 2026. The mistral-ocr-latest alias also points to OCR 4.1 today, but it moves when a new model ships, so use the versioned ID in production. The older mistral-ocr-2505 and mistral-ocr-2503 models are retired."
  - q: "How much does Mistral OCR cost?"
    a: "As of September 2026, Mistral's pricing and model pages list OCR 4.1 at $4 per 1,000 pages for OCR and $5 per 1,000 annotated pages for Document AI, the structured-extraction layer. Mistral's June 2026 OCR 4 launch post advertised batch jobs at a 50% discount."
  - q: "Can Mistral OCR be self-hosted or run on-premises?"
    a: "Not as open weights: Mistral has not released the OCR model weights. Enterprise customers can get a fully self-hosted deployment that runs in a single container, and the model is also available through Amazon SageMaker and Microsoft Foundry."
---

Mistral OCR is the pick when you want a **hosted, per-page OCR API** that keeps document layout, without running a parsing model yourself. Send it a PDF, an Office document or an image, and it returns **per-page Markdown plus structured JSON**: text, tables, images, hyperlinks, headers and footers, bounding boxes and confidence scores. The current model is **OCR 4.1** (`mistral-ocr-4-1`). Document AI, Mistral's layer on top, adds structured extraction (annotations) billed per annotated page.

## Highlights

- **OCR 4.1 is current.** Released July 16, 2026 and generally available since August 31, 2026; `mistral-ocr-latest` and `mistral-ocr-4` both point to it. OCR 3 (`mistral-ocr-2512`) is still listed as active.
- **Layout blocks in reading order.** `include_blocks` returns paragraph-level bounding boxes, each with one of 13 structural labels such as `title`, `table`, `equation`, `code`, `footer` or `signature`.
- **Confidence scores.** Set `confidence_scores_granularity` to `page`, `block` or `word`, then route low-confidence regions to human review.
- **Tables and page furniture.** `table_format` returns tables as Markdown or HTML, `extract_header` and `extract_footer` pull running headers and footers out of the body text, and hyperlinks come back as their own output.
- **Flexible input.** Pass a public URL, base64 data or a file uploaded through the Files API. The `pages` parameter accepts ranges such as `"0-5"`.
- **Batch and cloud routes.** `/v1/batch` handles bulk jobs, the model is also on Amazon SageMaker and Microsoft Foundry, and enterprise customers can self-host it in a single container.

## In an AI-assisted workflow

Mistral's official SDKs are `mistralai` for Python and `@mistralai/mistralai` for TypeScript, both Apache-2.0. After `pip install mistralai`, this example from the Python SDK repo parses a PDF by URL and prints the JSON response:

```python
import json
import os

from mistralai.client import Mistral

MISTRAL_7B_PDF_URL = "https://arxiv.org/pdf/2310.06825.pdf"


def main():
    api_key = os.environ["MISTRAL_API_KEY"]
    client = Mistral(api_key=api_key)

    # Using an URL
    pdf_response = client.ocr.process(
        document={
            "document_url": MISTRAL_7B_PDF_URL,
            "type": "document_url",
            "document_name": "mistral-7b-pdf",
        },
        model="mistral-ocr-latest",
        include_image_base64=True,
    )

    # Print the parsed PDF
    response_dict = json.loads(pdf_response.model_dump_json())
    json_string = json.dumps(response_dict, indent=4)
    print(json_string)


if __name__ == "__main__":
    main()
```

The example uses the `mistral-ocr-latest` alias; switch to `mistral-ocr-4-1` once the output feeds a production index. From Claude Code, prompts like these turn it into an ingestion step:

```text
Parse every PDF in ./contracts with mistral-ocr-4-1 and table_format set to html.
Write each page's markdown to its own file and keep the JSON response next to it.

Re-run page 3 with confidence_scores_granularity set to block and list the
lowest-confidence blocks so I can check them by hand.
```

OCR output is only half of ingestion. Tune chunk sizes on the Markdown with the [chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer) skill before you embed it. When you need specific fields from invoices or forms rather than full pages, compare Document AI annotations with the schema-first vision-model approach in the [multimodal-document-extractor](/skills/data/multimodal-document-extractor) skill.

> [!TIP]
> Pin the versioned model ID. `mistral-ocr-latest` moved to OCR 4.1 in July 2026, and `mistral-ocr-2505` was retired outright on May 31, 2026. An alias can change your output, and an old pin can stop working, without any change to your code.

## How it compares

Mistral OCR sits with the managed APIs in our [document parser roundup](/guides/comparisons/best-document-parsers-for-rag-2026). Its closest siblings:

| Tool | Runs where | Open source | Best for |
|---|---|---|---|
| Mistral OCR | Hosted; enterprise self-host | No; SDKs Apache-2.0 | Flat per-page OCR, layout blocks |
| [LlamaParse](/tools/llamaparse) | Hosted; enterprise BYOC | No | Tiered parsing, monthly free credits |
| [Reducto](/tools/reducto) | Hosted; VPC or on-prem on Enterprise | No | Parse, extract and split pipelines |
| [Docling](/tools/docling) | Your own machines | MIT | Local parsing of sensitive files |
| [Marker](/tools/marker) | Local, or Datalab's API | Code Apache-2.0; weights restricted | Local PDF-to-Markdown |

Choose Mistral OCR over LlamaParse when you'd rather budget against a flat per-page rate than map credit tiers to document types. Choose Reducto when you want parsing, extraction, splitting and classification as one platform, with VPC or air-gapped on-prem deployment. If documents can't leave your network and you have no enterprise contract, Docling and Marker run locally.

## Good to know

Plans, as of September 2026 from Mistral's pricing and model pages: OCR 4.1 costs $4 per 1,000 pages for OCR and $5 per 1,000 annotated pages for Document AI. Mistral's June 2026 OCR 4 launch post advertised batch jobs at a 50% discount.

The service and the model are proprietary. The OCR weights are not open, and fully self-hosted deployment goes through an enterprise agreement. `mistral-ocr-2505` (retired May 31, 2026) and `mistral-ocr-2503` (retired December 31, 2025) are gone, so migrate any pipeline still pinned to them. Before committing, run a sample of your own documents through it, especially scans and non-English files, and check the Markdown and tables by eye. For how dedicated OCR models compare with general vision-language models on documents, see [VLM OCR for documents](/guides/vision/vlm-ocr-documents).
