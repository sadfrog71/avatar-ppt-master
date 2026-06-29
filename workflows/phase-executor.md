# Phase B1: Executor

Use this phase to hand-author SVG pages, validate them, and generate speaker
notes. This is the highest-risk phase for context drift, so rely on project state
files rather than memory.

## Gate

- `design_spec.md` exists.
- `spec_lock.md` exists.
- Image acquisition is complete or skipped.
- Required manual images are not needed until export, but expected filenames must
  be tracked.

## References

Read:

```text
references/executor-base.md
references/shared-standards.md
references/modes/<locked-mode>.md
references/visual-styles/<locked-style>.md
```

Use `spec_lock.md` to determine `mode` and `visual_style`. For custom values,
skip preset files and follow custom behavior in `spec_lock.md`.

Never glob-load all modes or styles.

## Design Parameter Confirmation

Before the first SVG, output the locked design parameters:

- canvas dimensions
- color scheme / palette roles
- font plan
- body font size
- icon/image policy

Do not ask for approval here; the user already confirmed in Strategist.

## Live Preview

Start live preview before generating SVGs:

```bash
python3 ${SKILL_DIR}/scripts/svg_editor/server.py <project_path> --live
```

Run it as a long-lived process. Report the actual URL. Default port is 5050, but
the launcher may choose another free port.

Rules:

- Do not wait for preview approval before generating pages.
- Do not read or apply annotations during generation.
- Preview annotations are handled after export through `workflows/live-preview.md`.
- If the user applies direct browser edits and asks to re-export, re-run export
  steps as directed in `workflows/phase-export.md`.

## Pre-Generation Reads

Before the first SVG:

- batch-read every distinct layout SVG referenced in `spec_lock.page_layouts`
- batch-read every distinct chart SVG referenced in `spec_lock.page_charts`
- include backup charts from the design spec when relevant

Read each referenced template once up front.

## Required Pre-Gates

Run before visual construction:

```bash
python3 ${SKILL_DIR}/scripts/validate_focal_hierarchy.py <project_path>
python3 ${SKILL_DIR}/scripts/validate_visual_consistency.py <project_path> --stage=lock-only
```

Exit handling:

- exit 0: proceed
- exit 1: stop and fix `spec_lock.md` in the Strategist contract
- exit 2: review warnings; proceed only if acceptable

Do not skip these gates.

## Visual Construction

Generate SVG pages sequentially:

- one page at a time
- in the main agent
- into `<project_path>/svg_output/`

Before every page:

1. Re-read `<project_path>/spec_lock.md`.
2. Resolve the current page's:
   - `page_rhythm`
   - `page_layouts`
   - `page_charts`
   - `page_focal`
   - `page_tables`
   - `palette_roles`
   - `page_groups`
3. Use only approved colors, fonts, images, icons, and page structure.

Do not batch-generate pages. Do not script-generate SVG pages.

## Quality Check

After all SVGs and before notes/export, run:

```bash
python3 ${SKILL_DIR}/scripts/svg_quality_checker.py <project_path>
python3 ${SKILL_DIR}/scripts/validate_visual_consistency.py <project_path>
```

Fix all errors before proceeding. Handle warnings when straightforward; otherwise
acknowledge them.

Manual narrative checks:

- slide titles reconstruct the story
- each content page has an insight strip, hero metric interpretation, or so-what
- final section ends with recommendation, decision, next action, or conclusion
- limitations appear in notes or appendix when needed

## Speaker Notes

Generate:

```text
<project_path>/notes/total.md
```

Keep notes aligned to the final page order.

## Optional Post-Executor Workflows

- If the deck contains data charts, run `workflows/verify-charts.md` before export.
- If the user explicitly asks for visual review, run `workflows/visual-review.md`.
- Otherwise proceed directly to export.

## Phase Checkpoint

```markdown
## Executor Phase Complete
- [x] Live preview started and URL reported
- [x] Focal hierarchy pre-gate passed
- [x] Visual consistency lock gate passed
- [x] All SVG pages generated
- [x] SVG quality check passed with no blocking errors
- [x] Full visual consistency check passed with no blocking errors
- [x] Narrative checks completed
- [x] Speaker notes generated
- [ ] Next: Post-processing and export
```
