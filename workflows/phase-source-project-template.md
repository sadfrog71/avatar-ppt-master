# Phase A1: Source, Project, Template

Use this phase for source conversion, project creation, and optional template
dispatch. Keep it mechanical; do not make design decisions here.

## Gate

The user has provided at least one of:

- PDF / DOCX / XLSX / PPTX / EPUB / HTML / Markdown / CSV / TSV
- a URL
- direct text or requirements in chat
- a topic that has already been expanded through `workflows/topic-research.md`

If the user supplied only a topic name with no useful content, run
`workflows/topic-research.md` first.

## Step 1: Convert Source Content

When the source is not already Markdown/plain text, convert immediately:

| User provides | Command |
|---|---|
| PDF | `python3 ${SKILL_DIR}/scripts/source_to_md/pdf_to_md.py <file>` |
| DOCX / Word / Office / HTML / EPUB / other document | `python3 ${SKILL_DIR}/scripts/source_to_md/doc_to_md.py <file>` |
| XLSX / XLSM | `python3 ${SKILL_DIR}/scripts/source_to_md/excel_to_md.py <file>` |
| CSV / TSV | Read directly as plain-text table source |
| PPTX | `python3 ${SKILL_DIR}/scripts/source_to_md/ppt_to_md.py <file>` |
| Web link | `python3 ${SKILL_DIR}/scripts/source_to_md/web_to_md.py <URL>` |
| WeChat / high-security page | `python3 ${SKILL_DIR}/scripts/source_to_md/web_to_md.py <URL>` |
| Markdown | Read directly |

Windows note: if `python3` fails, retry the same command with `python`.

Office vector assets:

- Preserve EMF/WMF files extracted from DOCX/PPTX.
- Do not convert EMF/WMF to PNG.
- Live preview may not render EMF; final PPTX is the source of truth.

## Step 2: Initialize Project

Create the project:

```bash
python3 ${SKILL_DIR}/scripts/project_manager.py init <project_name> --format <format>
```

Default format is `ppt169`. For alternatives, read
`references/canvas-formats.md`.

Import source files when files exist:

```bash
python3 ${SKILL_DIR}/scripts/project_manager.py import-sources <project_path> <source_files...> --move
```

Rules:

- Use `--move`, not copy.
- Put converted Markdown, original files, and extracted assets into the project.
- If the user provided text directly in chat, no import is needed.

## Step 3: Optional Template Dispatch

Default is free design. Skip template handling unless the user provided explicit
template directory paths.

Trigger rule:

| User input | Action |
|---|---|
| Explicit directory path containing `design_spec.md` with frontmatter `kind: brand`, `kind: layout`, or `kind: deck` | Dispatch the template |
| Bare template names, style labels, brand names, vague requests, or silence | Skip template handling |
| User asks "what templates exist?" | List indexes and paths only; do not advance pipeline |

Do not fuzzy-match bare names to directories. The user must provide a usable path.

### Template Kinds

| Kind | Meaning |
|---|---|
| `brand` | Identity only: color, typography, logo, voice, icon style |
| `layout` | Structure only: canvas, page types, SVG roster |
| `deck` | Full replica: identity, structure, and overview |

Copy template files into the project, separating bitmaps:

```bash
TEMPLATE_DIR=<user-supplied path>
cp -r ${TEMPLATE_DIR}/* <project_path>/templates/
find <project_path>/templates -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' -o -iname '*.webp' -o -iname '*.bmp' \) -exec mv {} <project_path>/images/ \;
```

Template SVGs remain references in `templates/`. Runtime page SVGs are generated
later into `svg_output/` and reference images via `../images/`.

### Multi-Template Fusion

When multiple paths of different kinds are provided, fuse at segment level:

| Combination | Identity | Structure | Middle |
|---|---|---|---|
| brand only | brand | free design | none |
| layout only | free design | layout | none |
| deck only | deck | deck | deck |
| brand + layout | brand | layout | none |
| brand + deck | brand | deck | deck |
| layout + deck | deck | layout | deck |
| brand + layout + deck | brand | layout | deck |

Same-kind conflicts:

- Do not infer ordering.
- Report segment-level conflicts.
- Ask the user to pick source A, source B, or resolve segment by segment.
- If three or more same-kind paths are provided, ask the user to reduce to two.

When fusion happens, add a provenance block below the H1 of the fused
`templates/design_spec.md`.

## Phase Checkpoint

End with a concise checkpoint:

```markdown
## Source / Project Phase Complete
- [x] Source content is available
- [x] Project created
- [x] Sources imported when applicable
- [x] Template handling completed or skipped
- [ ] Next: Strategist phase
```
