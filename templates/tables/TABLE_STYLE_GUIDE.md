# Table Style Guide

The design contract every preset in this directory respects. Executor must preserve these rules when adapting a preset to a project.

## 1. Header weight (pick one per preset)

- **Soft band**: light fill (`#F8FAFC` or `colors.surface_subtle`), bold uppercase labels (`#475569`, `letter-spacing="1"`), no border. Used by `editorial_zebra`, `kpi_summary_band`.
- **Accent band**: filled with `colors.accent` (`#3B82F6` family) or a darker tonal, white labels. Used by `ledger_financial`, `comparison_columns_table` (non-accented columns only).
- **Borderless**: header text only, no fill, a single 2 px rule beneath. Used by `scorecard_dotmatrix`, `timeline_swimlane`.

## 2. Column alignment

| Column type | Alignment |
|---|---|
| Identifier / code | left |
| Long label / description | left |
| Category / one-word tag | center |
| Small integer (count, score) | center |
| Currency / large number / percent / delta | right |
| Status pill / dot glyph | center |

Never mix left and right alignment within the same column.

## 3. Row tint discipline (pick at most one)

- **Solid white** — preferred for `comparison_columns_table` and `kpi_summary_band` (accent comes from column / band treatment instead).
- **Soft zebra** — alternating `#FFFFFF` / `#F8FAFC` at ~50 % alpha. Used by `editorial_zebra` only.
- **Full white + soft separators** — `#E2E8F0` 1 px between rows. Used by `ledger_financial`, `scorecard_dotmatrix`, `timeline_swimlane`.

## 4. Total / summary row

- Only one row may be visually accented; it MUST be the total / summary if one exists.
- Treatment: `#EFF6FF` fill (or `colors.accent_subtle`), `#1D4ED8` bold label (or `colors.accent_strong`), no inner separators.
- If the table has no totals, do not accent any row.

## 5. Vertical structure

- **Full grid** (horizontal + vertical lines, all `#E2E8F0` 1 px). Allowed only when both row count ≥ 5 AND every cell is a hard data point. Used by `ledger_financial`.
- **Horizontal only** (rules between rows, no verticals). Default for `editorial_zebra`, `scorecard_dotmatrix`, `comparison_columns_table`.
- **No internal rules** (whitespace separates rows). Default for `kpi_summary_band`, sometimes for `timeline_swimlane` when cells are pill-shaped.

## 6. Column accent (comparison_columns_table only)

When showing 2–4 options side by side, ONE column receives accent treatment:
- 4 px left border in `colors.accent`, or
- subtle fill (`colors.accent_subtle` at ~6 % alpha), or
- accent header band while siblings stay soft.

Never apply accent to two columns; never apply zero accent. The chosen column is the recommended / winning / anchored option (Strategist decides; Executor reads `design_spec.md §IX` for the cue).

## 7. Maximum density

- Canonical layout fits ≤ 6 data rows + 1 total row in viewBox `0 0 1280 720`.
- If the page needs more rows, request page-split from Strategist rather than shrinking type below the body ramp's minimum.

## 8. Type sizes (anchored on `typography.body`, default body = 14 px)

| Role | Size | Weight |
|---|---|---|
| Section title above table | 32 px | 800 |
| Section sub-label (eyebrow) | 14 px | 700, letter-spacing 1 |
| Column header label | 13 px | 800, letter-spacing 1, uppercase |
| Body cell (label) | 15 px | 600 |
| Body cell (number) | 15–16 px | 600–700 |
| Total row label | 15 px | 800, letter-spacing 1 |
| Total row number | 16 px | 800 |
| Source / footnote | 12 px | 600 |

## 9. Forbidden combinations

The validator / quality checker does not catch these directly, but Executor and reviewers must refuse them:

1. Full grid + zebra + accent header simultaneously (visual noise; pick at most two).
2. Two accent columns in `comparison_columns_table`.
3. Multiple accent rows (only the total row gets accent, and only when totals exist).
4. Mixed-alignment numeric column (e.g., some cells center, some right).
5. Body type below body × 0.85 to fit more rows. Split the page instead.
6. Header bg same as body bg (defeats the band; switch to borderless header).
