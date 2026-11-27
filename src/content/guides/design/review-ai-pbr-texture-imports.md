---
title: Review AI PBR Texture Imports Against the Target Material
description: "Check AI-generated PBR textures on import: color space per map, metallic-roughness channel packing for glTF and Unity, normal map direction, and a Blender test."
author: Imtiaz Rayhan
date: '2026-08-25'
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
- pbr
- textures
- gltf
- blender
- normal-maps
featured: false
related:
- guide:review-ai-generated-3d-meshes
- tool:meshy
- glossary:physically-based-rendering
- glossary:uv-mapping
- skill:3d-asset-handoff-sheet
summary: "Most bad PBR imports come from three settings: a data map read as color, metallic and roughness taken from the wrong channels, or a normal map with its green channel pointing the other way. Check each map's role, color space and channels against the target's convention, then confirm in a lit render before you approve the asset."
depth: standard
sources:
- title: Text to 3D API
  url: https://docs.meshy.ai/en/api/text-to-3d
  publisher: Meshy
- title: glTF 2.0 Specification
  url: https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html
  publisher: Khronos Group
- title: glTF 2.0 add-on, Blender Manual
  url: https://docs.blender.org/manual/en/5.0/addons/import_export/scene_gltf2.html
  publisher: Blender Foundation
- title: Mask map and detail map (HDRP)
  url: https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/Mask-Map-and-Detail-Map.html
  publisher: Unity
- title: Normal map (Bump mapping)
  url: https://docs.unity3d.com/Manual/StandardShaderMaterialParameterNormalMap.html
  publisher: Unity
- title: Texture Asset Editor
  url: https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-asset-editor-in-unreal-engine
  publisher: Epic Games
keyTakeaways:
- Base color and emissive are sRGB; metallic, roughness, occlusion and normal maps are linear data and must be imported as non-color.
- glTF packs roughness in green and metallic in blue; Unity HDRP's mask map uses red for metallic, green for occlusion and alpha for smoothness.
- glTF, Blender and Unity use +Y (OpenGL-style) normal maps; if bumps look dented under a known light, flip the green channel.
- A filename says what a map was meant to be, not how it is encoded; confirm in a lit render of the real mesh.
- Record the mesh, UV and texture versions together, because a texture set only fits the UV layout it was made for.
faq:
- q: Can filenames prove that metallic and roughness maps are assigned correctly?
  a: No. A file called roughness.png may be a single grayscale map, or one channel of a packed image, and nothing in the name says whether the importer read it as color data. Open each file, look at its channels, check the color space setting in the target, and confirm with a lit render.
- q: Which channel is roughness in a glTF texture?
  a: Green. The glTF 2.0 specification puts roughness in the G channel and metalness in the B channel of metallicRoughnessTexture, both stored linearly. Occlusion uses the R channel of its own texture, so one image can carry all three, a layout often called ORM.
- q: How do I tell an OpenGL normal map from a DirectX one?
  a: Light the surface from a known direction and look at a raised detail such as a rivet. If it looks pressed into the surface, the green channel is inverted for your target. glTF, Blender and Unity expect +Y, the OpenGL style. Unreal Engine's texture editor has a Flip Green Channel setting for maps authored the other way.
- q: Why does my imported model look washed out or too shiny?
  a: The usual cause is color space. A roughness or metallic map imported as sRGB gets a gamma curve applied to its values, which shifts every surface toward the wrong roughness. Set those maps to Non-Color in Blender, or turn off the sRGB option in Unity and Unreal.
---

A folder of textures is not a material. The same four images can render as brushed steel or as wet plastic depending on which channel the engine reads, which color space it assumes, and which way the normal map's green channel points. A generated asset adds one trap: the preview on the generator's site is rendered with the generator's own conventions, so it tells you nothing about how your importer will read the same files.

Start from the [mesh handoff review](/guides/design/review-ai-generated-3d-meshes) so the geometry is already accepted. This pass is about the material on that mesh.

## Know the conventions before you import

These are the settings that decide the result. The glTF rows are from the [Khronos glTF 2.0 specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html).

| Map | Color space | glTF 2.0 | Unity HDRP mask map |
| --- | --- | --- | --- |
| Base color | sRGB | RGB, with optional alpha coverage in A | Separate base map |
| Metallic | Linear | B channel of `metallicRoughnessTexture` | R channel |
| Roughness | Linear | G channel of `metallicRoughnessTexture` | Stored as smoothness in A (invert roughness) |
| Occlusion | Linear | R channel of `occlusionTexture`, may share the same image | G channel |
| Normal | Linear | Tangent space, +X right, +Y up | +Y, per Unity's manual |
| Emissive | sRGB | RGB | Separate map |

Three things follow from the table.

**Only base color and emissive are colors.** Everything else is numeric data stored in an image. If the importer treats a roughness map as sRGB, it applies a gamma curve to numbers that were never gamma-encoded, and the whole surface shifts.

**Packing differs between targets.** glTF's layout puts occlusion, roughness and metallic in R, G and B of one image, often called an ORM texture. Unity's HDRP mask map puts metallic in R, occlusion in G, a detail mask in B and smoothness in A. A glTF-style packed texture dropped into an HDRP mask slot gives you occlusion values as metalness, with no error message.

**Normal maps have a handedness.** glTF defines the green channel as +Y up, which Unity's manual calls "Y+ normal maps, sometimes known as OpenGL format", and Blender's glTF documentation uses the same. Other pipelines use the opposite direction, usually called DirectX style. Unreal Engine's Texture Editor has a **Flip Green Channel** option for this, and an **sRGB** checkbox that Epic's documentation says to uncheck when channels are used individually as masks.

[Physically based rendering](/glossary/physically-based-rendering) covers why the model works this way.

## Inventory what the generator gave you

List the files you actually received and what each one is. [Meshy](/tools/meshy) is a useful example because its [API documentation](https://docs.meshy.ai/en/api/text-to-3d) is explicit: a refine task returns `texture_urls` with a `base_color` map, and `metallic`, `roughness` and `normal` maps only if the task was created with `enable_pbr: true`. An emission map appears only for some model versions. So a missing roughness map may mean the option was off, not that the asset has no roughness variation. Do not fill the gap with a guess; regenerate, or agree a constant value with the asset's owner and write it down.

Note that these arrive as separate grayscale files, not a packed image, so any packing is something you or your exporter did afterwards.

For each file, record:

| Field | Example |
| --- | --- |
| File and version | `lantern_T2_roughness.png` |
| Intended role | Roughness |
| Channels that hold data | Grayscale, identical R, G and B |
| Color space to import as | Non-Color |
| Where it plugs in | Roughness input, or G of a packed texture |
| Mesh and UV version it belongs to | `lantern_v3.glb`, UV set 0 |

The last row matters. A texture set fits the [UV layout](/glossary/uv-mapping) it was generated for. If the mesh was remeshed, decimated or re-unwrapped after texturing, the textures no longer line up, whatever the filenames say.

## Walkthrough: check the import in Blender

Blender is a good neutral inspector because it shows the node graph and matches glTF conventions. The steps below follow the glTF 2.0 add-on documentation in the Blender manual.

1. **Import.** `File > Import > glTF 2.0 (.glb/.gltf)`. If you have a mesh and loose texture files instead, import the mesh and build the material by hand in step 3.
2. **Open the Shading workspace** and select the object. The material appears as a Principled BSDF with Image Texture nodes feeding it.
3. **Check each Image Texture node's Color Space.** Base color: sRGB. Metallic, roughness, occlusion and normal: Non-Color. This is the setting most often wrong on hand-built materials.
4. **Check the channel routing.** For a packed glTF texture the image should pass through a Separate Color node (Separate RGB in older versions), with G going to Roughness and B to Metallic. For separate grayscale maps, each plugs straight into its input.
5. **Check the normal path.** The normal image must go through a Normal Map node set to Tangent Space, then into the Normal input. An image plugged directly into Normal is a common mistake and produces flat or wrong shading.
6. **Render under a light you control.** Switch the viewport to Rendered, add one strong light from above and to one side, and orbit the model.

A correct graph, written out:

```text
Image (base_color, sRGB)        -> Principled BSDF: Base Color
Image (ORM, Non-Color) -> Separate Color
                          G     -> Principled BSDF: Roughness
                          B     -> Principled BSDF: Metallic
Image (normal, Non-Color) -> Normal Map (Tangent Space)
                                -> Principled BSDF: Normal
```

## Read the render

Match what you see to a cause, then change one setting and render again.

| What you see | Likely cause | Test |
| --- | --- | --- |
| Whole surface too glossy or too matte, evenly | Roughness map read as sRGB | Set Color Space to Non-Color |
| Painted or plastic areas look like chrome | Metallic taken from the wrong channel, or occlusion read as metallic | Swap the Separate Color outputs; view each channel alone |
| Shiny where it should be rough, and the reverse | Roughness and smoothness confused, so the map is inverted | Invert the map once and compare |
| Raised details look dented; lighting seems to come from below | Normal map green channel flipped | Invert G, or use the engine's flip-green option |
| No surface detail at all | Normal image bypasses the Normal Map node, or strength is 0 | Rebuild the normal path |
| Colors washed out | Base color imported as Non-Color or Linear | Set to sRGB |
| Details land in the wrong place, seams cross faces | Textures made for a different UV layout | Re-pair with the matching mesh export |

Change one thing at a time. If you fix color space and channel order together and the model looks right, you do not know which one mattered, and the next asset from the same source will cost you the same hour.

Preview the three data maps on their own before blaming the engine. A metallic map should be mostly black and white with little gray. A roughness map should have visible variation. A normal map should be predominantly light blue-violet; one that looks like a grayscale image is a bump or height map, not a normal map, and needs a different node.

## Example: a lantern with a chrome back panel

This example is illustrative, not a recorded test. A lantern arrives as `lantern_v3.glb` plus four loose maps, and an artist packs occlusion, roughness and metallic into one image for a Unity HDRP project. In the engine the painted back panel renders as polished metal.

The inventory finds the cause without opening a debugger. The packed image is in glTF order: occlusion in R, roughness in G, metallic in B. HDRP's mask map reads R as metallic, so it is using the occlusion values, which are near white on a flat exposed panel, as metalness. Alpha, where HDRP expects smoothness, is empty.

The fix is a repack: metallic to R, occlusion to G, inverted roughness to A, imported with **sRGB (Color Texture)** turned off, as Unity's documentation requires for mask maps. One render under the same light confirms the panel is paint again. The recorded change is "mask map repacked from glTF ORM order to HDRP order", which the next person can reuse.

## Hand off a recipe someone can repeat

Approval covers one mesh, one UV layout, one texture set and one target. Send these together:

- Mesh file, UV set and texture set, each with a version, plus the untouched original downloads
- The map inventory, including any map that was missing and what was used in its place
- Target application and version, and the color space and channel setting for every map
- Any conversion you made: repacking, inverting roughness, flipping the normal map's green channel
- Two or three renders with the light direction noted, and which views were not checked
- What triggers a recheck: a new mesh export, a re-unwrap, a regenerated texture, or a different engine

The [3D asset handoff sheet](/skills/design/3d-asset-handoff-sheet) skill organizes those notes into one document. It works from the reports and observations you give it; it cannot render the material or open the binary files, so the lit render stays a human step.
