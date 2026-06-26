# Execution Lock

> **⚠️ Skeleton for Strategist — do NOT copy verbatim into a project.** When producing `<project_path>/spec_lock.md`, emit only `##` sections with filled-in `-` data lines. Do NOT carry over any `>` blockquote guidance, HARD-rule notes, or override examples — those are author-time guidance, not runtime data. Every output line must be parseable data.
>
> Machine-readable execution contract. Executor MUST `read_file` this before every SVG page. Values not listed here must NOT appear in SVGs. For design narrative (rationale, audience, style), see `design_spec.md`.
>
> After SVG generation begins, this is the canonical source for color / font / icon / image values. Modifications should go through `scripts/update_spec.py` to keep this file and generated SVGs in sync.

## canvas
- viewBox: 0 0 1280 720
- format: PPT 16:9

> Strategist: fill viewBox and format for the chosen canvas. Common values: `0 0 1280 720` (PPT 16:9), `0 0 1024 768` (PPT 4:3), `0 0 1242 1660` (Xiaohongshu), `0 0 1080 1080` (WeChat Moments), `0 0 1080 1920` (Story).

## mode
- mode: pyramid

> Strategist: the deck's narrative skeleton, locked at confirmation `d` Layer 1. One of `pyramid` / `narrative` / `instructional` / `showcase` / `briefing` — see [`references/modes/_index.md`](../references/modes/_index.md). Executor reads only the locked mode's file. Deck-wide. Or the literal `custom` for a bespoke direction no preset captures (a special cadence, a multi-mode fusion, a particular posture) — user-requested or Strategist-recommended (user confirms, like every lock). Then add a sibling `- mode_behavior:` paragraph (how the argument advances, title voice, page rhythm, register) that the Executor follows in place of a preset file. One deck locks one value; don't default to `custom` when a preset fits.

## narrative
- executive_answer: "One sentence the deck should leave behind."
- supporting_framework: pyramid
- number_hooks: metric_1, metric_2, metric_3
- slide_contract: title + core_message + purpose + content_texture + visualization_or_image + insight_strip + so_what

> Strategist: concise memory anchors for the Executor. These values do not replace `mode`; they explain the argument the pages should collectively land. Keep lines short and parseable. Omit only when the brief is too small to justify a separate narrative lock.

## chrome
- footer: "source / confidentiality / date"
- page_number: true
- accent_line: "top-left primary line"
- section_marker: "short chapter label"
- insight_strip: "bottom takeaway line using accent background"

> Strategist: reusable page furniture that creates deck-level coherence. Keep it minimal and compatible with `visual_style`. Executor mirrors this across inner pages unless a template's locked mirror mode already defines equivalent furniture.

## visual_style
- visual_style: swiss-minimal

> Strategist: the deck's visual aesthetic, locked at confirmation `d` Layer 2. A preset name from [`references/visual-styles/_index.md`](../references/visual-styles/_index.md), **or** the literal `custom`. Reference intent (shape / decoration / whitespace / texture) — **not a whitelist**, and **carries no HEX** (color truth stays in `colors`). Executor reads only the locked style's file.
>
> **`custom`** — add a sibling `- visual_style_behavior:` row with a one-paragraph aesthetic description (shape language, decoration density, whitespace, typographic character, texture); no HEX, no color names. Tail-case, not a default.

## colors
- bg: #FFFFFF
- primary: #......
- accent: #......
- secondary_accent: #......
- text: #......
- text_secondary: #......
- border: #......
- image_rendering: vector-illustration
- image_palette: cool-corporate

> Strategist: fill only colors actually used. Add extra rows as needed; delete unused rows rather than leave as `#......`.
>
> **`image_rendering` and `image_palette`** — required only when `images` section below contains `ai`-sourced files. Values MUST be valid names from `references/image-renderings/_index.md` and `references/image-palettes/_index.md`, **or** the literal string `custom`. Image_Generator reads these and applies them deck-wide. Omit both rows when the deck has no AI-generated images.
>
> **`custom` escape hatch.** When set to `custom`, add a sibling `*_behavior` row carrying a one-paragraph prose description. Image_Generator splices the prose into the prompt in place of the preset file's fewshot snippet. Tail-case only — see [`image-renderings/_index.md`](../references/image-renderings/_index.md) §1.5 / [`image-palettes/_index.md`](../references/image-palettes/_index.md) §2 for invocation rules.
>
> ```
> - image_rendering: custom
> - image_rendering_behavior: "Hand-screened poster aesthetic — slightly misregistered halftone overlays, 3 flat ink colors with visible dot pattern at 12% opacity, no gradients, no anti-aliased edges; reads as silkscreen print."
> - image_palette: custom
> - image_palette_behavior: "Primary deep aubergine `#4C1D95` anchors ~35% of canvas; secondary warm cream `#FEF3C7` carries ~55% as breathing field; accent burnished gold `#D4AF37` in 5-10% as ceremonial accents. No fourth color."
> ```

## typography
- font_family: "Microsoft YaHei", Arial, sans-serif
- title_family: Georgia, SimSun, serif
- body_family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif
- emphasis_family: Georgia, SimSun, serif
- code_family: Consolas, "Courier New", monospace
- body: 22
- title: 32
- subtitle: 24
- annotation: 14

> **All five family lines are listed explicitly** so Strategist considers every role — `code_family` and `emphasis_family` are easily forgotten. In a real `spec_lock.md`:
> - Keep any `*_family` whose role genuinely differs from `font_family`.
> - **Omit** any `*_family` equal to `font_family` — Executor falls back to `font_family` for missing roles, so writing it twice is noise. (Exception: keep `code_family` even when equal — monospace is conceptually distinct.)
> - `code_family` applies to code snippets only. LaTeX formulas rendered by `latex_render.py` are PNG image assets and must be listed under `images`.
>
> `font_family` is the default fallback. Every declared family is a CSS font-stack string.
>
> **Source**: copy verbatim from the *Per-role font stacks* list in `design_spec.md §IV Font Plan`. Stack **order** encodes browser-rendering intent (Latin-led vs. CJK-led) that the breakdown table cannot — strings here must match character-for-character. See `design_spec.md §IV` for the explainer.
>
> Sizes (`body` / `title` / etc.) are in px, matching SVG units. `body` is the **required baseline anchor** — all other sizes derive as ratios of it (ramp table: `design_spec_reference.md §IV`).
>
> **Size slots are anchors, not a closed menu.** Common slots (`title` / `subtitle` / `annotation`) cover frequent cases. Add role-specific slots (e.g. `cover_title: 72`, `hero_number: 48`, `chart_annotation: 13`) when needed — common for cover-heavy decks, consulting-style hero numbers, dense pages. Executor may use intermediate sizes as long as the ratio to `body` sits in the role's ramp band.
>
> **⚠️ PPT-safe stack discipline (HARD rule).** PPTX stores one `typeface` per run with no runtime fallback. Every stack MUST end with a cross-platform pre-installed font: `"Microsoft YaHei", sans-serif` / `SimSun, serif` / `Arial, sans-serif` / `"Times New Roman", serif` / `Consolas, "Courier New", monospace`. Non-preinstalled fonts (Inter / Google Fonts / brand typefaces) may lead the stack only when the Design Spec notes the font-install or embedding requirement.
>
> **Stack length discipline.** 3-4 fonts per stack is the sweet spot. Converter only writes the **first** Latin and **first** CJK font into PPTX — everything after is silently dropped. macOS-only families (`Songti SC`, `Menlo`, `Monaco`, `Helvetica`) are auto-mapped to Windows equivalents via `FONT_FALLBACK_WIN` (see `scripts/svg_to_pptx/drawingml_utils.py`); stacking both is redundant. Lead with Windows-preinstalled fonts (`Microsoft YaHei` / `SimSun` / `Arial` / `Georgia` / `Consolas`); keep at most **one** macOS-exclusive family (typically `"PingFang SC"`) as a browser-preview nicety.

## icons
- library: chunk-filled
- brand_library: simple-icons
- inventory: target, bolt, shield, users, chart-bar, lightbulb

> `library` MUST be exactly one of `chunk-filled` / `tabler-filled` / `tabler-outline` / `phosphor-duotone` — mixing is forbidden. `brand_library: simple-icons` is optional; include only when the deck uses real company / product brand marks, otherwise omit. `inventory` lists approved icon names (no library prefix); Executor may only use icons from this list.
>
> **`stroke_width` (stroke-style libraries only)** — required when `library` is stroke-based (currently `tabler-outline`); allowed values `1.5` / `2` / `3`. Executor MUST apply this value to every `<use data-icon="...">` placeholder via `stroke-width`, deck-wide. Omit for non-stroke libraries (`chunk-filled` / `tabler-filled` / `phosphor-duotone`) — ignored there. For heavier weight switch library; do not exceed `3` (at 24×24 strokes merge and the icon stops reading as line art).
>
> Example for stroke-style libraries:
> ```
> - library: tabler-outline
> - stroke_width: 2
> - inventory: home, chart-bar, users, bulb
> ```

## images
- cover_bg: images/cover_bg.jpg
- q3_revenue_chart: images/q3_revenue.png | no-crop
- formula_001: images/formula_001.png | no-crop

> One entry per image file used. Append ` | no-crop` only for images that must not lose pixels (data screenshots, charts, certificates, rendered LaTeX formulas) — Executor will size the container to native ratio and use `preserveAspectRatio="xMidYMid meet"`. Untagged entries default to croppable (`slice`). Remove the section entirely if no images.

## page_rhythm
- P01: anchor
- P02: dense
- P03: breathing
- P04: dense
- P05: dense
- P06: breathing
- P07: anchor

> One entry per page. Key: `P<NN>` (zero-padded, matching `§IX Content Outline` in `design_spec.md`). Value: one of the three rhythm tags. Executor reads per page and applies the tag's layout discipline — breaks the "every page looks the same" pattern.
>
> **Vocabulary** (exactly these three values):
> - `anchor` — Structural pages (cover / chapter opener / TOC / ending). Follow the template as-is.
> - `dense` — Information-heavy pages (data, KPIs, comparisons, multi-point lists). Card grids, multi-column layouts, tables, charts all permitted.
> - `breathing` — Low-density pages (single concept, hero quote, big image + caption, section transition). Avoid **multi-card grid layouts** (multiple parallel rounded containers as the primary structure); organize via naked text, dividers, whitespace, or full-bleed imagery. Single rounded elements (hero image corners, callouts, tags, one emphasis block) are fine. Proportions follow information weight — not a preset ratio menu.
>
> **Rhythm follows narrative**: `breathing` pages appear where narrative genuinely pauses — section transitions, a single argument worth standalone emphasis, a deliberate stop after a dense sequence. A data briefing or consulting analysis may legitimately be nearly all `dense` — **do not invent filler pages** to pad rhythm. Validation: every `breathing` page must answer "what independent thing is this page saying?".
>
> **Missing or empty section** → Executor falls back to `dense` for every page (legacy pre-rhythm behavior). Remove the section only for legacy decks; new decks MUST fill it.

## page_layouts
- P01: 01_cover
- P03: 02a_chapter
- P04: 03a_content_abstract

> One entry per page **that uses a template SVG**. Key: `P<NN>` matching §IX. Value: the template's SVG basename without extension (e.g., `01_cover`, `03a_content_image_text`) — Executor resolves it to `templates/<value>.svg`. Modern templates ship many content-page variants (`03a_content_abstract`, `03b_content_image_text`, `03c_content_three_items` …); the page-type → single-file mapping in `executor-base.md §1` no longer covers them, so this section is the per-page truth.
>
> **No entry for a page** → that page is free design (no template inheritance). Mixed decks are supported: e.g., cover/chapter pages inherit a template while content pages are free.
>
> **Hard rule**: Use both `page_layouts` and `page_charts` for the same page only when the layout template is a compatible shell for the chart. Do not assign a conflicting layout just to fill every page: a waterfall chart should not inherit a timeline layout, and KPI cards should not inherit a circle-diagram layout unless that is the intended visual structure. When no compatible layout exists, omit the page from `page_layouts`.
>
> **Whole section omitted** → entire deck is free design. Equivalent to no rows but cleaner; do this when zero pages reference a template.
>
> **Strategist source**: copy the per-page SVG choices from `design_spec.md §VI Page Roster` (or §IX outline if Roster is absent). Names must match files in `templates/` exactly — typos cause silent fallback to free design.

## page_charts
- P05: bar_chart
- P09: timeline_horizontal
- P12: quadrant_bubble_scatter

> One entry per page **that adapts a `templates/charts/` chart template**. Key: `P<NN>` matching §IX. Value: chart template basename without `.svg` (must match a key in `templates/charts/charts_index.json`).
>
> **No entry for a page** → no chart on that page (or a chart that did not match any catalog template — Strategist's `no-template-match` fallback). Both cases mean Executor designs the visualization from scratch per `design_spec.md §VII`.
>
> **Whole section omitted** → no data-visualization pages in this deck.
>
> **Strategist source**: copy from `design_spec.md §VII Visualization Reference List` — only the rows whose `reference template path` points to a `templates/charts/` file. Pages marked `no-template-match` in §VII MUST NOT appear here.

## page_focal
- P01: L1="封面主张" | L2=[副标题,日期] | L3=[]
- P02: L1="三大风险已识别" | L2=[风险A,风险B,风险C] | L3=[来源,时点]
- P03: L1="增长来自存量复购" | L2=[复购率,客单价,频次] | L3=[同比,环比]

> **Mandatory section** — every `P<NN>` that appears in `design_spec.md §IX` MUST have a row here. Missing rows fail `scripts/validate_focal_hierarchy.py` and block Step 6 SVG generation.
>
> **Inner grammar** (parsed by the validator, not by `update_spec.parse_lock`): `L1="<headline>" | L2=[item, item, ...] | L3=[item, item, ...]`. The `|` separates tiers; commas inside `[...]` separate items. L2/L3 values are bare strings (no quotes); double-quote chars are forbidden inside list items.
>
> **Tier semantics**:
> - **L1** — the single line a reader should remember from the page. Exactly one. ≤18 CJK / ≤36 Latin chars. Rendered as the largest text element (anchor templates: title slot; free-design: top-left, ≥body × 2.0 ramp). No other text on the page may match or exceed L1 in size.
> - **L2** — supporting items that make L1 credible. 2–4 items. Each ≤12 CJK / ≤24 Latin. Executor MUST NOT render more parallel content blocks than L2 declares.
> - **L3** — context (source, date, scope, caveat). 0–3 items, may be empty `[]`. Each ≤10 CJK / ≤20 Latin.
>
> **Rhythm interaction**: when `page_rhythm` is `breathing`, keep L2 ≤2 (warning, not error). When the page is also in `page_tables`, L2 should be 3–4 (warning if outside).
>
> **Anti-pattern (planner-side)**: noun-phrase topic labels (`"行业概览"`, `"现状分析"`) instead of assertions trigger a warning (skipped for `anchor` pages where a label is acceptable). Aim for an assertion the audience can agree or disagree with.
>
> **Strategist source**: produced in `references/strategist.md §6.1.1 step 9 (Focal hierarchy planning)`; cross-check the `Core message` field in `design_spec.md §IX` — L1 is the one-line distillation of Core message.

## page_tables
- P05: editorial_zebra
- P09: ledger_financial
- P12: scorecard_dotmatrix

> One entry per page **that adapts a `templates/tables/` table-style preset**. Key: `P<NN>`. Value: preset basename without `.svg` (must match a key in `templates/tables/tables_index.json`).
>
> **Mutual exclusion (HARD)**: a page MUST NOT appear in both `page_charts` and `page_tables`. Strategist picks the dominant primitive — pages whose visualization is fundamentally a table go here; pages whose visualization is a chart go in `page_charts`.
>
> **No entry for a page** → no designed-table preset (free-design table OR no table at all on that page).
>
> **Whole section omitted** → deck has no preset-driven table pages.
>
> **Strategist source**: copy from `design_spec.md §VII Visualization Reference List` — only the rows whose `reference template path` points to a `templates/tables/` file. Catalog: `templates/tables/tables_index.json`; selection rules per preset live there.

## palette_roles
- bg_canvas: #FFFFFF
- surface_subtle: #F8FAFC
- text_primary: #0F172A
- text_secondary: #475569
- text_muted: #94A3B8
- border_subtle: #E2E8F0
- accent_primary: #2563EB
- accent_subtle: #DBEAFE
- state_success: #10B981
- state_warning: #F59E0B
- state_danger: #EF4444

> **Mandatory section** — every deck must declare semantic palette roles. Missing or incomplete rows fail `scripts/validate_visual_consistency.py --stage=lock-only` and block Step 6 SVG generation.
>
> **Inner grammar**: each line is `- <role>: <HEX>`. Role names use `[a-z0-9_]+` and must be unique within the section. HEX values must be `#RRGGBB` or `#RRGGBBAA` (3-digit `#RGB` shorthand is not allowed for palette_roles entries — it is allowed elsewhere in SVG content for non-palette decoration).
>
> **Required roles** (validator hard error if missing): `bg_canvas`, `text_primary`, `text_secondary`, `border_subtle`, `accent_primary`. Add any of the following optional roles when the deck genuinely needs them:
> - Surface — `surface_subtle`, `surface_emphasis`
> - Text — `text_muted`
> - Border — `border_emphasis`
> - Accent — `accent_subtle`, `accent_emphasis`
> - State — `state_success`, `state_warning`, `state_danger`, `state_info`
>
> **Relationship to `## colors`**: `## colors` stays as the strategist input + `update_spec.py` color replacement working set (backward compatible). `## palette_roles` is the **downstream truth** — every SVG `fill` / `stroke` / `stop-color` HEX MUST appear in this section. The two sections may overlap freely; `palette_roles` may carry additional roles that `colors` does not (e.g., split a single `accent` into `accent_primary` + `accent_subtle`). Validator does NOT require strict mirroring.
>
> **Strategist source**: produced in `references/strategist.md §6.1.1 step 10 (Palette role mapping)`. Map each HEX in `design_spec.md §III Visual Theme` to a role; add extra roles when the spec needs more granularity than `colors` captures.
>
> **Executor consumption**: when rendering SVGs, every fill / stroke / stop-color HEX MUST be one declared here. Inventing new HEXes mid-generation is forbidden — return to Strategist to extend `palette_roles` instead.

## page_groups
- P01: hero=[L1] | meta=[L2_1,L2_2] | chrome=[]
- P02: headline=[L1] | grid=[L2_1,L2_2,L2_3] | footnote=[L3_1]
- P03: hero=[L1,L2_1] | matrix=[L2_2,L2_3,L2_4] | source=[L3_1]

> **Mandatory section** — every `P<NN>` declared in `design_spec.md §IX` MUST have a row here. Missing or malformed rows fail `scripts/validate_visual_consistency.py` and block Step 6 SVG generation.
>
> **Inner grammar** (parsed by the validator, not by `update_spec.parse_lock`):
>
> ```
> P<NN>: <group_name>=[<slot>, <slot>, ...] | <group_name>=[<slot>, ...] | ...
> ```
>
> - `group_name` is a Strategist-chosen semantic label (`hero`, `grid`, `matrix`, `chrome`, `footnote`, `source`, etc.) using `[a-z0-9_]+`. Group names within a page must be unique.
> - Slot tokens are `L1`, `L2_<N>`, `L3_<N>` (N is 1-based, refers to position in the same page's `page_focal` row).
> - All slots from `page_focal.P<NN>` (L1 + every L2 item + every L3 item) MUST be covered by the union of group slots, exactly once. Cross-group duplicates are forbidden.
> - Empty groups (e.g., `chrome=[]`) are allowed when the slot is supplied by the template chrome (footer / page number) rather than by `page_focal`.
>
> **Hard constraints**:
> 1. **Intra-group visual parity** — all slots inside one `<g data-group="<name>">` MUST render with the same visual treatment: same font size band, same primary `palette_role` for fill, same baseline / column alignment.
> 2. **Cross-group separation** — different groups MUST use visibly different containers. A `footnote` group MUST NOT reuse the same card geometry (rx + fill role) as a `grid` group.
> 3. **Group count** — recommended 2-4 groups per page (hero + body + chrome). Pages with 1 or ≥5 groups trigger a validator warning.
>
> **Executor consumption**: each parallel content block MUST be wrapped in `<g data-group="<name>" data-l2-item="<N>">…</g>` (anchor attributes are how the validator detects "5 cards rendered when L2 declared 3"). L1 / L3 slots do not require `data-l2-item`; only L2 items do. See `references/executor-base.md §2.1` group-anchor rules.
>
> **Strategist source**: produced in `references/strategist.md §6.1.1 step 11 (Page group planning)`. Group names should describe the page's reading order ("what does the reader look at first / second / third"). Do not pad pages with single-element groups to inflate the count; group count must be load-bearing.

## forbidden
- Mixing icon libraries
- rgba()
- `<style>`, `class`, `<foreignObject>`, `textPath`, `@font-face`, `<animate*>`, `<script>`, `<iframe>`, `<symbol>`+`<use>`
- `<g opacity>` (set opacity on each child element individually)
- HTML named entities in text (`&nbsp;`, `&mdash;`, `&copy;`, `&ndash;`, `&reg;`, `&hellip;`, `&bull;` …) — write as raw Unicode (`—`, `©`, `→`, NBSP, etc.); XML reserved chars `& < > " '` must be escaped as `&amp; &lt; &gt; &quot; &apos;`. See shared-standards.md §1.0
