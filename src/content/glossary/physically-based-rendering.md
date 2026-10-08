---
description: Review an AI material handoff without confusing supplied map files with verified appearance in
  the target scene.
date: '2026-09-27'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- designers
- developers
tags:
- 3d-assets
- physically-based-rendering
featured: false
related:
- guide:review-ai-pbr-texture-imports
- glossary:uv-mapping
- tool:meshy
summary: A fictional lantern material illustrates why role assignments, version pairing and actual viewer evidence
  belong in the handoff.
term: Physically Based Rendering
---

Physically based rendering represents surface appearance through material parameters and lighting. Supplied maps still need target-view review.

For an invented lantern asset, the handoff might include color, metallic, and roughness information. The review packet needs to identify which file and channel supplies each requested role in the chosen target setup. A roughness file placed into the wrong assignment can produce a result that differs from the owner’s intent, even when every file was successfully imported.

The [PBR import workflow](/guides/design/review-ai-pbr-texture-imports) records the chosen format’s conventions, target settings, lighting, and actual viewer evidence. Avoid treating one format’s material recipe as a universal rule for every application. When encoding information is missing, preserve the uncertainty instead of guessing from a filename.

Use the [UV mapping term](/glossary/uv-mapping) when reviewing version pairing in the asset packet. Keep that layout version paired with the mesh and maps during review. A changed layout or a different target material setup can invalidate an earlier appearance decision.

[Meshy](/tools/meshy) is one source to consider for generated 3D assets and texture outputs. Review the actual returned files and the actual target render. The PBR label does not certify visual quality, asset rights, or suitability for a particular use; a named owner accepts the inspected combination against a supplied brief.
