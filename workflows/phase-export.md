# Phase B2: Post-Processing and Export

Use this phase to split speaker notes, finalize SVG assets, and export PPTX.

## Gate

- Executor phase is complete.
- SVG pages exist in `<project_path>/svg_output/`.
- Speaker notes exist at `<project_path>/notes/total.md`.
- If any image row is `Needs-Manual`, every required file exists in
  `<project_path>/images/`.

If required manual image files are missing, pause. List the missing filenames and
point the user to `<project_path>/images/image_prompts.md` when it exists.

## Canonical Export Pipeline

Run the three commands one at a time. Do not combine them.

### Step 7.1: Split Notes

```bash
python3 ${SKILL_DIR}/scripts/total_md_split.py <project_path>
```

### Step 7.2: Finalize SVG

```bash
python3 ${SKILL_DIR}/scripts/finalize_svg.py <project_path>
```

This performs required post-processing such as icon embedding, image crop/embed,
text flattening where applicable, and rounded-rect handling. Do not replace it
with `cp`.

### Step 7.3: Export PPTX

```bash
python3 ${SKILL_DIR}/scripts/svg_to_pptx.py <project_path>
```

Default output:

- `exports/<project_name>_<timestamp>.pptx`
- `backup/<timestamp>/svg_output/`

The native PPTX export reads `svg_output/` directly so editable primitives can be
preserved. Add `--svg-snapshot` only when the user wants a self-contained visual
preview PPTX as well.

Do not use `--only`; it suppresses expected outputs.

## Optional Export Adjustments

Use only when the user asks:

- strict line fidelity: add `--no-merge`
- page transition: `-t <effect>`
- element entrance animation: `-a <effect>`
- presenter-paced animation: `--animation-trigger on-click`
- kiosk auto-play: `--auto-advance <seconds>`
- object-level animation tuning: read `workflows/customize-animations.md`
- recorded narration: read `workflows/generate-audio.md`

Default export already includes normal transition/animation behavior. Do not
create `animations.json` unless object-level customization was requested.

## Preview Edits and Annotations

If the user submitted annotations and asks to apply them, read
`workflows/live-preview.md` and follow its post-export annotation path.

If the user made direct browser edits and clicked Apply changes, then asks to
re-export, re-run Step 7.2 and Step 7.3. No annotation-application step is needed
unless they also saved AI-needed annotations.

If preview is not running and the user asks to see it, read
`workflows/live-preview.md` and start it.

## Phase Checkpoint

```markdown
## Export Complete
- [x] Speaker notes split
- [x] SVG post-processing completed
- [x] PPTX exported
- [x] Backup snapshot written
```
