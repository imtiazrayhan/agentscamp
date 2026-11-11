---
term: "GGUF"
description: "GGUF is the single-file binary model format used by llama.cpp and other GGML-based runtimes, storing quantized tensors plus typed metadata in one file."
date: 2026-10-07
topics: ["mlops-ai-infra"]
audience: ["ai-engineers", "developers"]
tags: ["gguf", "llama-cpp", "quantization", "local-llm", "model-formats"]
related: ["tool:llama-cpp", "tool:ollama", "tool:lm-studio", "glossary:quantization", "guide:best-open-source-llms-2026", "tool:jan", "tool:vllm"]
faq:
  - q: "What does Q4_K_M mean in a GGUF filename?"
    a: "A 4-bit K-quant at the M mix level. The K-quants are the block quantization family introduced in llama.cpp in June 2023; the _S, _M and _L suffixes are tensor mixes, not literal sizes. Q4_K_S quantizes every tensor to Q4_K, while Q4_K_M keeps half of the attention.wv and feed_forward.w2 tensors at the higher-precision Q6_K, trading a little size for lower perplexity loss."
  - q: "Which tools can run a GGUF file?"
    a: "llama.cpp and everything built on it: Ollama (via a Modelfile line such as FROM /path/to/file.gguf), LM Studio, Jan, GPT4All, KoboldCpp, llamafile and text-generation-webui. Hugging Face Transformers can load GGUF with the gguf_file argument, and vLLM supports it only through an external plugin that it labels highly experimental."
  - q: "How is GGUF different from safetensors?"
    a: "Safetensors stores tensors only. GGUF stores tensors and a standardized set of typed key-value metadata, including the architecture and tokenizer, which is why a single .gguf file is enough for a runtime to load the model and why the Hugging Face Hub can show its metadata in a viewer."
summary: "GGUF is a binary file format for storing models for inference with GGML-based runtimes such as llama.cpp. It succeeded GGML, GGMF and GGJT, with key-value metadata so one memory-mappable file holds everything needed to load a model. Quantized variants are named by scheme and mix, such as Q4_K_M, and run in Ollama, LM Studio and Jan."
---

**GGUF is a binary file format for storing models for inference with GGML and GGML-based executors, designed so that one file contains everything a runtime needs to load the model.** The ggml specification describes it as "a successor file format to GGML, GGMF and GGJT," "designed to be unambiguous by containing all the information needed to load a model" and extensible "so that new information can be added to models without breaking compatibility."

The key change from its predecessor GGJT was replacing a list of untyped hyperparameters with key-value metadata, which fixed the old formats' inability to say which architecture a file was for. Its stated goals are single-file deployment, `mmap` compatibility, extensibility and full information. Hugging Face's docs note that, unlike tensor-only formats such as safetensors, "GGUF encodes both the tensors and a standardized set of metadata," and the Hub has a viewer for GGUF metadata and tensor shapes.

The filename tells you the quantization. `Q4_K_M` is a 4-bit K-quant at the M mix level; the K-quants are the 2- to 6-bit block schemes added to [llama.cpp](/tools/llama-cpp) in June 2023, and `_S`, `_M` and `_L` denote tensor mixes rather than literal sizes. `Q4_K_S` uses Q4_K for every tensor, while `Q4_K_M` keeps half of the `attention.wv` and `feed_forward.w2` tensors at Q6_K. llama.cpp's quantize tool lists the trade on Llama-3-8B: Q4_K_M at 4.58G with +0.1754 perplexity, against Q8_0 at 7.96G with +0.0026. The general idea is covered under [quantization](/glossary/quantization).

GGUF is the lingua franca of local LLMs. [Ollama](/tools/ollama) imports a file with a Modelfile line, `FROM /path/to/file.gguf`; [LM Studio](/tools/lm-studio) runs "llama.cpp (GGUF) or MLX models"; [Jan](/tools/jan) bundles the llama.cpp engine; GPT4All, KoboldCpp, llamafile, text-generation-webui and Hugging Face Transformers load it too. [vLLM](/tools/vllm), by contrast, calls its GGUF support "highly experimental" and has moved it to an external plugin. For which open-weight models are worth downloading in this format, see [the best open-source LLMs in 2026](/guides/comparisons/best-open-source-llms-2026).
