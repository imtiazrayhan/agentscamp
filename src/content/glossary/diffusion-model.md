---
term: "Diffusion Model"
description: "A diffusion model generates an image by starting from random noise and removing it step by step, guided by a prompt, until a coherent picture remains."
date: 2026-09-10
topics: ["multimodal-ai", "data-ml"]
audience: ["designers"]
tags: ["diffusion", "image-generation", "models", "inference"]
related: ["glossary:text-to-image", "tool:fal", "tool:replicate", "guide:best-ai-image-generators-2026", "guide:claude-design-guide"]
summary: "A diffusion model is the technique behind most image, video, and audio generators: it learns to reverse a noising process, so it can start from static and denoise it into an image that matches your prompt. Step count, guidance, and seed are the knobs designers actually touch."
faq:
  - q: "Why do more steps sometimes not help?"
    a: "Because denoising has diminishing returns. Past a certain step count the image stops changing meaningfully while the cost and wait keep rising, and on some models a high guidance value combined with many steps produces oversaturated, overcooked results. The defaults published on a model card are usually close to the sweet spot."
  - q: "What does the seed do?"
    a: "It fixes the starting noise. The same prompt, model, and settings with the same seed reproduce the same image, which is how you change one word in a prompt and see only that change instead of a completely different picture. It is the closest thing image generation has to version control."
  - q: "Are all AI image tools diffusion models?"
    a: "Most are, but not all, and a product is rarely one model. A generator you use through a canvas may chain a prompt rewriter, a base model, an upscaler, and a safety filter, and some newer image systems use related but different generative approaches under the same prompt box."
---

**A diffusion model generates an image by reversing a noising process: it starts from random static and removes noise step by step, guided by your prompt, until a coherent picture remains.** Training teaches it the reverse of a simple procedure — take real images, add noise until they are unrecognizable — so at generation time it can walk that path backwards from pure noise.

Most systems run this in a compressed latent space rather than on full-resolution pixels, which is why an image can be produced in seconds on one GPU. Three settings surface to users: step count, which trades time for refinement; guidance strength, which controls how literally the model follows the prompt at the cost of variety; and the seed, which fixes the starting noise so a result is reproducible. Those three explain most of the difference between a tool that feels controllable and one that feels like a slot machine.

Diffusion is the technique; [text-to-image](/glossary/text-to-image) is the task it is best known for, though the same approach drives video, audio, and inpainting. Designers meet these models through a canvas app, and developers meet them through an inference cloud: [fal](/tools/fal) specializes in generative media billed per output or per compute, and [Replicate](/tools/replicate) runs a broad open-model catalog billed per second or per output. Which model families are worth reaching for is covered in [the best AI image generators in 2026](/guides/comparisons/best-ai-image-generators-2026), and the surrounding design stack in the [Claude Design guide](/guides/design/claude-design-guide).
