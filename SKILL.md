---
name: avatar-ppt-master
description: >
  AI-driven multi-format SVG content generation system. Converts source documents
  (PDF/DOCX/URL/Markdown) into high-quality SVG pages and exports to PPTX through
  staged planning, SVG execution, validation, and export. Use when user asks to
  "create PPT", "make presentation", "生成PPT", "做PPT", "制作演示文稿", "生成演示文稿",
  "网页 PPT", or mentions "ppt-master".
---

# PPT Master Skill

This skill is a staged PPT production pipeline. The main file is intentionally a
thin router: load only the phase file and references needed for the current task.
Do not read every reference up front.

Core pipeline:

`Source -> Project -> Optional Template -> Strategist -> Optional Images -> Executor -> Quality Check -> Export`

## 0. Routing

First classify the user's request.

| Request | Action |
|---|---|
| Create a deck from source material, topic, URL, document, notes, or requirements | Run the main pipeline below |
| Resume generation from an existing `projects/<name>` path, e.g. `继续生成 projects/...` | Read `workflows/resume-execute.md` |
| Fill a native PPTX template rather than generate SVG pages | Read `workflows/template-fill-pptx.md` |
| Create or register a layout/deck template | Read `workflows/create-template.md` |
| Create a brand preset | Read `workflows/create-brand.md` |
| User asks for live preview, annotations, browser edits, or re-export after preview edits | Read `workflows/live-preview.md` |
| User asks to verify chart geometry or chart coordinates | Read `workflows/verify-charts.md` |
| User asks for visual self-check / visual review after SVG generation | Read `workflows/visual-review.md` |
| User asks for object-level animation tuning | Read `workflows/customize-animations.md` |
| User asks for narration/audio/video-style export | Read `workflows/generate-audio.md` |

If the request is ordinary deck creation, continue to the main pipeline.

## 1. Non-Negotiable Rules

These rules apply across all phases.

1. Execute phases serially. A phase may start only after its gate is satisfied.
2. Hard stops are real stops. When a phase says to wait for user confirmation, wait.
3. Do not bundle work across phases before prerequisites exist.
4. Do not generate SVG pages during Strategist or Image Acquisition.
5. Do not delegate Step 6 SVG page generation to sub-agents.
6. Generate SVG pages sequentially in the main agent, one page at a time.
7. Before every SVG page, re-read `<project_path>/spec_lock.md` and use it as the source of truth.
8. Do not script-generate SVG pages in batch. Hand-author page SVGs in the main agent.
9. Use only colors, fonts, icon plans, image paths, page focal data, page rhythm, and page groups allowed by `spec_lock.md`.
10. Run required validators before export; fix errors before proceeding.
11. Preserve EMF/WMF assets from Office sources. Do not rasterize them to PNG for the pipeline.
12. Match the user's language unless they explicitly ask otherwise. Keep `design_spec.md` headings/field names in the original English template structure.

## 2. Main Pipeline

### Phase A1: Source, Project, Template

Gate: user has source material, a URL, a topic, or substantive requirements.

Read:

```text
workflows/phase-source-project-template.md
```

Expected outputs:

- `<project_path>/`
- `sources/` populated when files were provided
- `templates/` populated only when the user provided explicit template directory paths

If the user supplied only a topic name with no source material or substantive brief,
read and run `workflows/topic-research.md` first, then return to Phase A1.

### Phase A2: Strategist

Gate: project exists and template handling is complete or skipped.

Read:

```text
workflows/phase-strategist.md
references/strategist.md
templates/design_spec_reference.md
templates/spec_lock_reference.md
```

Expected outputs:

- `<project_path>/source_digest.md` when source-heavy
- `<project_path>/design_spec.md`
- `<project_path>/spec_lock.md`
- optional formula PNG assets and manifest

This phase contains the single bundled user confirmation point for canvas, page
count, audience, style, color, icon usage, typography/formulas, and image usage.

### Phase A3: Image Acquisition

Gate: `design_spec.md` and `spec_lock.md` exist; image rows are known.

Run only if `design_spec.md` has pending image rows with `Acquire Via: ai` or
`Acquire Via: web`.

Read:

```text
workflows/phase-image-acquisition.md
references/image-base.md
```

Then lazy-load only the needed path-specific reference:

| Needed row type | Additional reference |
|---|---|
| `Acquire Via: ai` | `references/image-generator.md` |
| `Acquire Via: web` | `references/image-searcher.md` |

Expected outputs when applicable:

- `<project_path>/images/image_prompts.json`
- `<project_path>/images/image_prompts.md`
- `<project_path>/images/image_sources.json`
- all pending image rows moved to `Generated`, `Sourced`, or `Needs-Manual`

If the user confirmed split mode, stop after this phase and hand off via
`workflows/resume-execute.md`.

### Phase B1: Executor

Gate: Phase A2 is complete, and Phase A3 is complete or skipped.

Read:

```text
workflows/phase-executor.md
references/executor-base.md
references/shared-standards.md
references/modes/<locked-mode>.md
references/visual-styles/<locked-style>.md
```

For `mode: custom` or `visual_style: custom`, skip the preset file and follow
the custom behavior stored in `spec_lock.md`.

Expected outputs:

- live preview service started and reported
- all SVG pages in `<project_path>/svg_output/`
- validators passed or warnings consciously handled
- `<project_path>/notes/total.md`

If the deck contains charts, run `workflows/verify-charts.md` before export.
Run `workflows/visual-review.md` only when the user explicitly asks for it.

### Phase B2: Post-Processing and Export

Gate: all SVG pages and speaker notes exist; required image files are present.

Read:

```text
workflows/phase-export.md
references/shared-standards.md
```

Expected outputs:

- split speaker notes
- finalized SVG assets where applicable
- exported PPTX in `<project_path>/exports/`
- backup snapshot in `<project_path>/backup/`

## 3. State and Checkpoints

Use project files as durable state. Do not rely on memory for long decks.

| File / folder | Purpose |
|---|---|
| `sources/` | Imported source files and converted Markdown |
| `templates/` | User-supplied template specs/SVG references |
| `images/` | User images, generated images, web-sourced images, formulas |
| `source_digest.md` | Source compression and narrative planning |
| `design_spec.md` | Human-readable design and content plan |
| `spec_lock.md` | Machine-readable execution contract; re-read before each SVG page |
| `svg_output/` | Hand-authored page SVGs consumed by native PPTX export |
| `notes/total.md` | Speaker notes before splitting |
| `exports/` | Final PPTX files |
| `backup/` | Frozen source snapshots for re-export |

At the end of each phase, output a concise checkpoint with completed items and
the next phase. Do not expose huge internal checklists unless the user asks.

## 4. Load Discipline

- Read the smallest relevant workflow/reference file for the current phase.
- Never glob-load all `references/modes/` or `references/visual-styles/`.
- Never read all templates or icons by default. Query indexes only when a phase
  explicitly requires it or the user asks what exists.
- For long decks, recommend split mode after Phase A3. Resume Phase B in a fresh
  context with `workflows/resume-execute.md`.
- If context compression happens, recover from project state files, especially
  `spec_lock.md`, rather than reconstructing from memory.

## 5. Main Scripts

| Script | Purpose |
|---|---|
| `scripts/source_to_md/pdf_to_md.py` | PDF to Markdown |
| `scripts/source_to_md/doc_to_md.py` | DOCX/Office/HTML/EPUB/etc. to Markdown |
| `scripts/source_to_md/excel_to_md.py` | XLSX/XLSM to Markdown |
| `scripts/source_to_md/ppt_to_md.py` | PPTX to Markdown |
| `scripts/source_to_md/web_to_md.py` | Web page to Markdown |
| `scripts/project_manager.py` | Project init / import / validation |
| `scripts/analyze_images.py` | Image analysis |
| `scripts/latex_render.py` | Formula PNG rendering |
| `scripts/image_gen.py` | AI image generation |
| `scripts/image_search.py` | Web image acquisition |
| `scripts/validate_focal_hierarchy.py` | Focal hierarchy and table gate |
| `scripts/validate_visual_consistency.py` | Spec lock / palette / font / group validation |
| `scripts/svg_quality_checker.py` | SVG technical quality checks |
| `scripts/total_md_split.py` | Speaker note splitting |
| `scripts/finalize_svg.py` | SVG post-processing |
| `scripts/svg_to_pptx.py` | PPTX export |
| `scripts/update_spec.py` | Propagate locked style changes |

For script details, read `scripts/README.md` only when needed.

## 6. Role Switch Protocol

Before switching roles, read the corresponding reference file and print:

```markdown
## [Role Switch: <Role Name>]
Reading role definition: references/<filename>.md
Current task: <brief description>
```

## 7. Reference Index

| Resource | Path |
|---|---|
| Strategist role | `references/strategist.md` |
| Executor common rules | `references/executor-base.md` |
| Shared SVG/PPT constraints | `references/shared-standards.md` |
| Canvas formats | `references/canvas-formats.md` |
| Image base framework | `references/image-base.md` |
| AI image generation | `references/image-generator.md` |
| Web image search | `references/image-searcher.md` |
| Image layout patterns | `references/image-layout-patterns.md` |
| Image layout sizing | `references/image-layout-spec.md` |
| SVG image embedding | `references/svg-image-embedding.md` |
| Animation options | `references/animations.md` |
| Icon library | `templates/icons/README.md` |
