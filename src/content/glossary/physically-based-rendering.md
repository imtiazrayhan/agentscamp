---
term: Physically Based Rendering
description: Physically based rendering (PBR) shades 3D surfaces with a small set of measurable material properties so they look consistent under any lighting.
date: '2026-09-27'
updated: '2026-11-27'
reviewed: '2026-11-27'
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
summary: Physically based rendering (PBR) describes a surface with physical properties (base colour, metallic, roughness, plus normal and occlusion maps) and shades it with energy-conserving light maths, so one material looks right in any lighting. AI 3D generators output PBR texture sets, which still need checking for baked lighting, colour space and channel packing.
faq:
  - q: "What maps make up a PBR material?"
    a: "In the common metallic-roughness workflow: base colour, metallic, roughness, a tangent-space normal map, and optionally ambient occlusion and emissive. glTF 2.0 packs roughness in the green channel and metallic in the blue channel of one texture, and occlusion is read from red."
  - q: "What is the difference between metallic-roughness and specular-glossiness?"
    a: "They are two parameterisations of the same idea. Metallic-roughness stores base colour, a metal/non-metal value and roughness; it is the glTF 2.0 core material. Specular-glossiness stores diffuse colour, specular colour and glossiness, which is the inverse of roughness. Maps from one cannot be dropped into the other without conversion."
  - q: "Why does an AI-generated texture look wrong after import?"
    a: "The usual causes are data maps (roughness, metallic, normal) read as sRGB instead of linear, a normal map using the opposite green-channel convention, channels packed in an order the target does not expect, or shadows and highlights baked into the base colour by the generator."
---

**Physically based rendering (PBR) is an approach to shading 3D surfaces that models how light actually interacts with materials, using a small set of physically meaningful properties, so the same asset looks plausible under any lighting.** Before PBR, artists tuned colours and highlights per scene; a PBR material is authored once and moved between engines and lighting setups.

## The principles

- **Energy conservation.** A surface never reflects more light than it receives. As a surface gets more reflective, its diffuse contribution drops.
- **Microfacets.** A surface is treated as many tiny mirrors. *Roughness* describes how scattered their orientations are: low roughness gives tight, sharp reflections; high roughness gives broad, dull ones.
- **Fresnel.** Every material reflects more at grazing angles.
- **Metals and dielectrics.** Metals have no diffuse colour and tint their reflections; non-metals (plastic, wood, skin) have a diffuse colour and weak, untinted reflections.
- **Linear light.** Shading maths is done in linear colour space, so colour textures authored in sRGB must be decoded first.

The artist-friendly parameter set most engines use traces back to Brent Burley's "Physically Based Shading at Disney" (SIGGRAPH 2012).

## The material maps

The **metallic-roughness** workflow is the most widely exchanged, and is the core material of [glTF 2.0](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html):

| Map | What it stores | Encoding in glTF 2.0 |
|---|---|---|
| Base colour (albedo) | Surface colour with no lighting in it | RGB, sRGB |
| Metallic | 0 for non-metal, 1 for metal | Blue channel, linear |
| Roughness | 0 smooth to 1 rough | Green channel, linear |
| Normal | Fine surface direction detail | RGB, linear, tangent space, +Y up |
| Occlusion | How much indirect light reaches crevices | Red channel, linear |
| Emissive | Light the surface gives off | RGB, sRGB |

Because occlusion, roughness and metallic use different channels, they are often packed into a single "ORM" image. The older **specular-glossiness** workflow stores diffuse, specular colour and glossiness (inverse roughness) instead. Maps are laid onto the model through its [UV mapping](/glossary/uv-mapping), so a texture set is only valid for the UV layout it was made for.

PBR is a shading model, not a renderer: the same material works in a real-time rasteriser and in an offline path tracer, though each approximates the lighting differently.

## Where AI comes in

Text-to-3D and image-to-3D generators such as [Meshy](/tools/meshy) can return a mesh with a PBR texture set, and texture generators produce tileable material maps from a prompt. That saves hours of authoring, but generated maps fail in recognisable ways:

- **Baked lighting.** Shadows and highlights painted into the base colour, so the asset looks lit from one side in every scene.
- **Wrong colour space.** Roughness, metallic or normal maps tagged sRGB, which shifts every value.
- **Normal map convention.** OpenGL-style (+Y, used by glTF) versus DirectX-style (-Y); a mismatch makes bumps look like dents.
- **Implausible values.** Metallic set to mid-grey across a surface that is plainly plastic, or roughness that is nearly uniform.
- **Channel packing.** A packed image whose channel order differs from what the target engine expects.
- **UV mismatch.** Textures regenerated without the mesh, or the mesh re-unwrapped without the textures.

## Example

A generated brass lantern arrives as `lantern.glb`. In the viewer the glass panes look like metal and the brass looks flat. Inspecting the material shows the roughness and metallic channels swapped, so the panes read as fully metallic, and a base colour with a highlight painted on one side. Swapping the channels fixes the panes; the baked highlight needs the base colour regenerated or repainted. Neither problem showed up as an import error, which is why PBR assets are checked by looking at them under more than one light. The [PBR import review guide](/guides/design/review-ai-pbr-texture-imports) lists what to record when you do.
