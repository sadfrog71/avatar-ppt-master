# Designed Table Preset Library

Curated, hand-authored SVG presets for table pages. Selected via `spec_lock.md ## page_tables`; loaded by Executor and visually adapted (project colors / typography / row counts) — never copied verbatim.

## Why a separate library

The chart library (`templates/charts/`) treats tables as data containers (`basic_table`, `consulting_table`, `feature_matrix_table`). These remain available for backward compatibility, but they all share the same visual register — colored header band + soft body + total row. Decks built entirely from chart-side tables look uniform.

`templates/tables/` is the *style* library. Each of the six presets is a different visual register, picked so the deck can use multiple table pages without each one looking like a recolored copy of the last.

## Quick selection map

| Preset | When |
|---|---|
| `editorial_zebra` | Narrative comparisons (criteria, vendor short-list, policy options) — readability over density. |
| `ledger_financial` | Numeric reporting with totals (budget, P&L, AR aging). |
| `scorecard_dotmatrix` | Multi-criterion scoring matrices (vendor evaluation, capability assessment). |
| `timeline_swimlane` | Swimlane-by-time-bucket schedules where each cell is a pill, not a duration bar. |
| `comparison_columns_table` | 2–4 side-by-side option comparisons with one accented column. |
| `kpi_summary_band` | Hero KPIs rendered as horizontal bands instead of cell grids. |

For full selection rules see [`tables_index.json`](./tables_index.json). For the design contract that all six respect see [`TABLE_STYLE_GUIDE.md`](./TABLE_STYLE_GUIDE.md).

## Adaptation rules (Executor)

1. Inherit the preset's *structure* (header weight, alignment per column type, total-row treatment, row-tint discipline, accent column placement). Do not inherit its *content* — fill from `design_spec.md §IX` text.
2. Project palette comes from `spec_lock.md colors`. Replace every preset HEX with the project's equivalent token (accent → `colors.accent`, header bg → `colors.surface_subtle` if defined, otherwise leave the preset's `#F8FAFC`).
3. Row count: aim for the preset's canonical row count (each preset states a target band in its summary). If the content has fewer rows, keep the layout sparse — do not stretch row heights to fill the page. If the content overruns, split into two pages rather than compressing.
4. The total row (when present) is the only visually accented row by default; do not stack accent treatments.
5. Never combine more than two of: full-grid lines, zebra body tint, accent header band. The presets already encode legal combinations.

## File list

```
tables/
├── README.md                       # this file
├── TABLE_STYLE_GUIDE.md            # cross-preset design contract
├── tables_index.json               # selection rules
├── editorial_zebra.svg
├── ledger_financial.svg
├── scorecard_dotmatrix.svg
├── timeline_swimlane.svg
├── comparison_columns_table.svg
└── kpi_summary_band.svg
```
