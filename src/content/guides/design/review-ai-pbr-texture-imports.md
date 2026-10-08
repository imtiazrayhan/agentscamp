---
description: Check an AI texture set in its actual target material setup, preserving map roles, UV information
  and viewer evidence before approving the asset.
date: '2026-08-25'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- designers
- developers
tags:
- 3d-assets
- review-ai-pbr-texture-imports
featured: false
related:
- guide:review-ai-generated-3d-meshes
- tool:meshy
- glossary:physically-based-rendering
- glossary:uv-mapping
- skill:3d-asset-handoff-sheet
summary: Check an AI texture set in its actual target material setup, preserving map roles, UV information
  and viewer evidence before approving the asset.
title: Review AI PBR Texture Imports Against the Target Material
depth: standard
sources:
- title: Text to 3D API
  url: https://docs.meshy.ai/en/api/text-to-3d
  publisher: Meshy
- title: glTF 2.0 Specification
  url: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
  publisher: Khronos Group
seoDescription: Check an AI texture set in its actual target material setup, preserving map roles, UV information
  and viewer evidence before approving the asset.
keyTakeaways:
- Freeze mesh, UV, and texture versions together before assigning map roles in the target material.
- Verify chosen-format channel and color-data conventions using exporter and target evidence.
- Record actual target renders, exact recipe changes, unresolved maps, and a version-specific owner decision.
faq:
- q: Can filenames prove that metallic and roughness maps are assigned correctly?
  a: No. Verify the exported role and channel information against the chosen format and target setup, then
    inspect an actual target render. Keep missing encoding evidence unresolved.
---

A texture folder is not an approved material. The same files can produce different results when map roles, channels, color-data settings, or UV versions differ. Review the exact mesh-and-texture combination in the actual target application, with a documented material recipe and human viewer evidence.

Begin with the [mesh handoff review](/guides/design/review-ai-generated-3d-meshes) so the geometry version is already identified. This pass checks the material import for that asset; it does not establish the suitability of a different mesh or scene.

## Freeze the asset combination

Register the mesh file, UV layout version, texture-set version, export format, target application and version, and the owner’s appearance brief. Keep original downloads unchanged and inspect a copy. Record any renamed, converted, resized, or repacked file as a derived version.

The [UV mapping term](/glossary/uv-mapping) explains why texture placement depends on the surface coordinates. Do not assume a texture set belongs to a mesh merely because their names share a prefix. Confirm the actual export pairing or preserve it as unresolved.

[Meshy](/tools/meshy) is one source of generated assets. Its [API documentation](https://docs.meshy.ai/en/api/text-to-3d) describes additional PBR maps for enabled refinement tasks. List the files actually returned by your task. An absent map might reflect task options; it is not permission to invent an output or claim a review was performed.

## Build a map-role inventory

Create a table that separates the file from its intended material role. Include the exporter’s evidence for the role, target assignment, channel selection, color-data setting, and any conversion. A filename containing “roughness” is a clue to investigate, not sufficient proof of its encoding.

Use the chosen format and target documentation to verify conventions. For glTF, the [Khronos specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) specifies sRGB base color and linear metallic/roughness data. Record how your target handles that specific format. Do not extend those settings to every importer or image file without evidence.

[Physically based rendering](/glossary/physically-based-rendering) describes the material model, but the presence of a PBR label does not settle assignments. Ask the owner which appearance matters, which maps are required, and whether missing roles may use approved defaults. Keep defaults distinguishable from supplied maps.

## Import under recorded conditions

Open the frozen asset combination in the actual target application. Record importer settings, assigned maps, channels, color-data treatment, material parameters, camera views, and lighting setup. Save warnings alongside the recipe. A generated preview is separate evidence and cannot stand in for this import.

Inspect the actual rendered or displayed surface. Capture human notes about seams, stretched areas, repeated details, unexpected shininess, or missing texture regions, with view references. State what the viewer observed before proposing a cause. A dark region can have several explanations; text alone cannot diagnose it from a file list.

Use a controlled comparison when investigating. Change one documented setting, reimport or rerender, and record the observed difference. If several settings change together, retain that limitation rather than claiming that one particular adjustment fixed the problem.

## Worked example: a fictional lantern material

The following files, notes, and outcomes are invented for teaching. The packet contains mesh v3, its stated UV layout, and texture set T2. A source preview shows an acceptable base color. The target’s material setup expects a documented metallic/roughness channel arrangement, but the draft import recipe copies file names without checking that arrangement.

| Item | Initial record | Missing evidence or action |
| --- | --- | --- |
| Base-color file | T2 color map assigned | Confirm target setting and actual view |
| Metallic/roughness file | Packed file named in export | Verify channel roles against chosen format |
| UV pairing | Mesh v3 and T2 listed | Confirm they belong to the same export |
| Final appearance | Source preview accepted | Target-view evidence still required |

A draft declaring “PBR materials imported correctly” is unsupported. The reviewer asks for the exporter’s role information and target documentation, records the correct recipe, and requests an actual render. Until the viewer result exists, the appearance remains untested.

Suppose the fictional viewer observes that the rear panel is much shinier than the approved reference. Record the observation and view ID. If a verified channel correction changes that appearance in a second render, record the exact before-and-after settings and the human result. Do not claim the correction succeeded merely because the rewritten recipe looks plausible.

If the exported channel information is unavailable, keep the role unresolved and ask the asset provider. If T2 belongs to a different UV layout, select the correct paired version and repeat the import. Neither problem is solved by writing a more detailed asset description.

## Review omissions and conflicts explicitly

Missing maps, incompatible target settings, and inconsistent exporter notes need separate decisions. The owner may authorize a default for a nonessential role, request regeneration, or reject the handoff. Record which choice was made and how it affects the intended appearance.

Do not conceal a warning because a front view looks acceptable. Check the agreed views under the recorded conditions, and state which views or material behaviors were not examined. If the brief changes from a static render to another use, request a new acceptance decision for that context.

The [3D asset handoff sheet](/skills/design/3d-asset-handoff-sheet) can organize supplied reports and viewer notes. A text-only assistant can compare those documents and identify gaps; it cannot render the material or inspect binary geometry merely by reading their paths.

## Hand off a reproducible recipe

Provide the exact mesh/UV/texture versions, unchanged source files, derived-file history, map-role table, target settings, lighting and view references, warnings, human observations, and owner decision. Include a recheck trigger for any changed mesh, UV layout, texture file, application, or material setting.

Acceptance applies to the inspected combination and target environment. The recipient should be able to recreate the setup and understand every unresolved item. Finishing this review means a supported import decision with reproducible evidence, not a universal guarantee that the texture set will look right everywhere.
