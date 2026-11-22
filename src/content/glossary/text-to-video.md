---
term: "Text-to-Video"
description: "Text-to-video is generating a video clip from a written prompt, using models that learn how scenes look from images and how they move from video."
date: 2026-11-15
topics: ["multimodal-ai"]
audience: ["designers", "marketers", "developers"]
tags: ["text-to-video", "video-generation", "diffusion", "generative-video", "t2v"]
related: ["guide:best-ai-video-generators-2026", "glossary:diffusion-model", "glossary:text-to-image", "tool:runway", "tool:kling", "glossary:ai-avatar"]
faq:
  - q: "How do text-to-video models work?"
    a: "The 2022 research systems extended text-to-image methods to motion. Meta's Make-A-Video learned what the world looks like and how it is described from paired text-image data, and how the world moves from unsupervised video footage. Google's Imagen Video generated high-definition video from a text prompt with a cascade of video diffusion models."
  - q: "How long are AI-generated video clips?"
    a: "Seconds rather than minutes, and it varies by model. Luma's Ray3.2, for example, produces 5- or 10-second native clips from text or an image, with longer outputs only when it modifies or reframes existing video. Clip length, resolution and native audio differ enough between models that our AI video generator comparison tracks them per model."
  - q: "Is text-to-video the same as an AI avatar video?"
    a: "No. Text-to-video generates a scene from a description. An AI avatar video animates a specific presenter, either a stock avatar or one trained on footage or a photo of a real person, to speak a script, which suits talking-head formats such as training and explainer videos."
summary: "Text-to-video is generating a short video clip from a written prompt. In 2022, Meta's Make-A-Video and Google's Imagen Video extended text-to-image methods to motion, the latter with cascaded video diffusion models. Current products bundle it with image-to-video and editing, make clips of seconds, and differ on resolution and native audio."
---

**Text-to-video is the task of generating a video clip from a written prompt: you describe a scene and its motion, and a model produces the frames.**

It grew out of [text-to-image](/glossary/text-to-image). Meta's Make-A-Video (arXiv 2209.14792, September 2022) set out to translate "the tremendous recent progress in Text-to-Image (T2I) generation to Text-to-Video (T2V)." Its approach was to "learn what the world looks like and how it is described from paired text-image data, and learn how the world moves from unsupervised video footage." Days later, Google's Imagen Video (arXiv 2210.02303) described "a text-conditional video generation system based on a cascade of video diffusion models," carrying the [diffusion](/glossary/diffusion-model) approach from single images to frames over time.

Products no longer treat text as the only input. Luma describes its Ray3.2 model as powering "four workflows in one: Modify Video, image2video, text2video, and Reframe," and its text and image modes produce 5- or 10-second native clips. Clip length, resolution, native audio and ownership terms differ between models, which is how [Best AI Video Generators in 2026](/guides/comparisons/best-ai-video-generators-2026) compares [Runway](/tools/runway), [Kling](/tools/kling), [Luma](/tools/luma) and others.

An [AI avatar](/glossary/ai-avatar) video is a narrower format: instead of generating a scene, it animates a presenter speaking a script.

Regulation now reaches the output. Article 50(2) of the EU AI Act requires providers of AI systems generating synthetic video, along with audio, image and text, to ensure outputs are "marked in a machine-readable format and detectable as artificially generated or manipulated." The article applies from 2 August 2026, and the Digital Omnibus amendment, Regulation (EU) 2026/1744, gives systems placed on the market before 2 August 2026 until 2 December 2026 to comply with Article 50(2).
