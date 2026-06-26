# Phase A2: Strategist

Use this phase to turn source material into a confirmed design/content plan and
a durable `spec_lock.md`. This is the only bundled confirmation point in the
main pipeline.

## Gate

- Project exists.
- Source material is ready.
- Template dispatch is complete or skipped.

Read before writing specs:

```text
references/strategist.md
templates/design_spec_reference.md
templates/spec_lock_reference.md
```

## Required Confirmation

Present these eight recommendations as one bundle and wait for explicit user
confirmation or edits before writing `design_spec.md` / `spec_lock.md`:

1. Canvas format
2. Page count range
3. Target audience
4. Style objective
5. Color scheme
6. Icon usage approach
7. Typography plan, including formula rendering policy
8. Image usage approach

After the eight items, also include:

- a short split-mode note
- a short spec-refinement opt-in note

If the user opts into refinement, read `workflows/refine-spec.md` after producing
the full design spec and stop for review before generation.

## Confirm UI

Default confirmation surface is the local UI unless the user asks for chat-only.

1. Write recommendations to:

```text
<project_path>/confirm_ui/recommendations.json
```

Use `scripts/docs/confirm_ui.md` for the schema when needed.

2. Launch and wait:

```bash
python3 ${SKILL_DIR}/scripts/confirm_ui/server.py <project_path> --daemon --wait
```

Use a long timeout, about 600000 ms. Report the actual URL from the launch log.
The default port is 5050, but the launcher may advance to another free port.

3. Always print the eight recommendations in chat with the URL.

4. Treat a fresh `<project_path>/confirm_ui/result.json` with
`status: confirmed` as authoritative. If the UI wait fails or times out, check
`result.json` once before falling back to chat confirmation.

5. After confirmation, shut down the confirm page:

```bash
python3 ${SKILL_DIR}/scripts/confirm_ui/server.py <project_path> --shutdown
```

Run shutdown on every path, including chat fallback.

## Confirmation Authority

User-confirmed values override recommendations. In particular:

| Confirmed image usage | Design spec `Acquire Via` | Step 5 behavior |
|---|---|---|
| `ai` or custom plan including AI | `ai` | Generate images |
| `web` | `web` | Search/source images |
| `provided` | `user` | Do not generate |
| `placeholder` | `placeholder` | Do not generate |
| `none` | no image rows | Do not generate |

Do not run AI image generation when the confirmed image plan does not include AI.

## Formula Handling

Formula policy belongs inside typography:

| Policy | Behavior |
|---|---|
| `mixed` | Render complex formulas; keep simple inline expressions editable |
| `render-all` | Render all formula-worthy expressions |
| `text-only` | Keep formulas as text / Unicode |

If rendering is needed:

1. Identify formulas explicitly.
2. Write `<project_path>/images/formula_manifest.json`.
3. Run:

```bash
python3 ${SKILL_DIR}/scripts/latex_render.py <project_path>
```

4. Add rendered formula PNGs to `design_spec.md` and `spec_lock.md`.

Do not scan `spec_lock.md` for dollar-delimited math. The renderer consumes the
manifest only.

## Image Analysis

If the user provided images or formula PNGs were rendered, run:

```bash
python3 ${SKILL_DIR}/scripts/analyze_images.py <project_path>/images
```

Do not directly inspect bitmap files. Use `analyze_images.py` output or the
Image Resource List.

## Source Digest and Planning Brief

Before writing specs, distill the source:

- write `source_digest.md` for source-heavy projects
- extract entities, dimensions, metrics, time periods, pain points, evidence,
  recommendations, and source locations where applicable
- assess source density and page count
- select a narrative arc that fits the confirmed mode
- ensure every planned page has title, core message, purpose, layout, content
  texture, visual intent, and so-what
- check that slide titles alone reconstruct the story
- define reusable deck chrome and takeaway treatment

For short chat-only briefs, embed the same summary in `design_spec.md`.

## Outputs

Write:

- `<project_path>/source_digest.md` when needed
- `<project_path>/design_spec.md`
- `<project_path>/spec_lock.md`

`design_spec.md` must follow the original English template section structure.

## Phase Checkpoint

```markdown
## Strategist Phase Complete
- [x] Eight confirmations completed
- [x] Split-mode and spec-refinement notes shown
- [x] Source digest / density / narrative plan completed
- [x] design_spec.md generated
- [x] spec_lock.md generated
- [ ] Next: Image acquisition or Executor phase
```
