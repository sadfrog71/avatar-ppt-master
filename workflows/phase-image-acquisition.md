# Phase A3: Image Acquisition

Use this phase only when the confirmed design spec contains pending image rows
with `Acquire Via: ai` or `Acquire Via: web`.

## Gate

- `design_spec.md` exists.
- `spec_lock.md` exists.
- Image usage has been confirmed by the user.

If all rows are `user`, `formula`, `placeholder`, or there are no image rows,
skip to Executor.

## References

Always read:

```text
references/image-base.md
```

Then lazy-load only what is needed:

| Row type | Read | Run |
|---|---|---|
| `Acquire Via: ai` | `references/image-generator.md` | `scripts/image_gen.py` manifest flow |
| `Acquire Via: web` | `references/image-searcher.md` | `scripts/image_search.py` flow |

Do not load `image-generator.md` for web-only decks. Do not load
`image-searcher.md` for AI-only decks.

## AI Image Rows

In-pipeline AI image generation must use manifest mode:

1. Write `<project_path>/images/image_prompts.json`.
2. Run:

```bash
python3 ${SKILL_DIR}/scripts/image_gen.py --manifest <project_path>/images/image_prompts.json
```

3. Render the sidecar:

```bash
python3 ${SKILL_DIR}/scripts/image_gen.py --render-md <project_path>/images/image_prompts.json
```

Do not use positional one-off image generation inside the main pipeline.

Honor the confirmed AI source path:

- `api` forces script/API path
- `host-native` forces host-native image tool path
- `manual` forces offline/manual path
- `auto` lets the workflow choose

See `references/image-generator.md` for selection details.

## Web Image Rows

Follow `references/image-searcher.md`.

Write provenance to:

```text
<project_path>/images/image_sources.json
```

Use sourced images only when licensing, quality, and relevance are acceptable for
the deck context.

## Failure Handling

For each pending image row:

1. Attempt the appropriate acquisition path.
2. Retry once when the failure is likely transient.
3. If still unavailable, mark the row `Needs-Manual`.
4. Continue the pipeline unless a required image file is missing at export gate.

Every row must end in one of:

- `Generated`
- `Sourced`
- `Needs-Manual`

No row should remain `Pending`.

## Split Mode Hand-Off

If the confirmed generation mode is split, stop after image acquisition and tell
the user to resume in a fresh chat:

```markdown
## Phase A Complete
- [x] Spec: design_spec.md, spec_lock.md
- [x] Resources: sources/, images/, templates/
- [ ] Next: open a fresh chat and input `继续生成 projects/<project_name>`
```

## Phase Checkpoint

```markdown
## Image Acquisition Phase Complete
- [x] image_prompts.json created when AI rows exist
- [x] image_prompts.md rendered when AI rows exist
- [x] image_sources.json created when web rows exist
- [x] All pending rows are terminal
- [ ] Next: Executor phase
```
