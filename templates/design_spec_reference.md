# {project_name} - Design Spec

> This document is the human-readable design narrative — rationale, audience, style, color choices, content outline. It is read once by downstream roles for context.
>
> The machine-readable execution contract lives in `spec_lock.md` (short form of color / typography / icon / image decisions). Executor re-reads `spec_lock.md` before every SVG page to resist context-compression drift. Keep the two files in sync; if they diverge, `spec_lock.md` wins.

## I. Project Information

| Item | Value |
| ---- | ----- |
| **Project Name** | {project_name} |
| **Canvas Format** | {canvas_info['name']} ({canvas_info['dimensions']}) |
| **Page Count** | [Filled by Strategist] |
| **Deck Type** | [Analysis / Vision / Training / Marketing — Filled by Strategist] |
| **Design Style** | {design_style} |
| **Target Audience** | [Filled by Strategist] |
| **Use Case** | [Filled by Strategist] |
| **Created Date** | {date_str} |

---

## II. Canvas Specification

| Property | Value |
| -------- | ----- |
| **Format** | {canvas_info['name']} |
| **Dimensions** | {canvas_info['dimensions']} |
| **viewBox** | `{canvas_info['viewbox']}` |
| **Margins** | [Recommended by Strategist, e.g., left/right 60px, top/bottom 50px] |
| **Content Area** | [Calculated from canvas] |

---

## III. Visual Theme

### Theme Style

- **Style**: {design_style}
- **Theme**: [Light theme / Dark theme]
- **Tone**: [Filled by Strategist, e.g., tech, professional, modern, innovative]

### Color Scheme

> Strategist should determine specific color values based on project content, industry, and brand colors

| Role | HEX | Purpose |
| ---- | --- | ------- |
| **Background** | `#......` | Page background (light theme typically white; dark theme dark gray/navy) |
| **Secondary bg** | `#......` | Card background, section background |
| **Primary** | `#......` | Title decorations, key sections, icons |
| **Accent** | `#......` | Data highlights, key information, links |
| **Secondary accent** | `#......` | Secondary emphasis, gradient transitions |
| **Body text** | `#......` | Main body text (dark theme uses light text) |
| **Secondary text** | `#......` | Captions, annotations |
| **Tertiary text** | `#......` | Supplementary info, footers |
| **Border/divider** | `#......` | Card borders, divider lines |
| **Success** | `#......` | Positive indicators (green family) |
| **Warning** | `#......` | Issue markers (red family) |

> **Reference**: Industry colors in `references/strategist.md` or `scripts/config.py` under `INDUSTRY_COLORS`

### Semantic Badge System

> Analysis-type decks MUST define semantic badges for skimmable data evaluation. Vision-type decks may skip this section.

| Badge Role | HEX | Purpose | Example Label |
| ---------- | --- | ------- | ------------- |
| **badge_risk** | `#DC3545` | Risk / lagging / critical | 风险, 落后, 饱和 |
| **badge_warning** | `#F6AD55` | Warning / medium / observe | 警告, 注意, 待观察 |
| **badge_leading** | `#38A169` | Leading / advantage /达标 | 领先, 优势, 达标 |
| **badge_info** | `#3182CE` | Info / neutral / reference | 信息, 正常, 参考 |
| **badge_highlight** | `[accent]` | Highlight / recommended / core | 重点, 推荐, 最高 |

**Badge usage rules**:
- Every evaluative data point in tables, cards, or comparisons MUST carry a badge
- Badge text: 10-11px, bold, white text on colored background
- Badge shape: rounded rectangle, padding 4-8px horizontally
- Badge placement: inside table cells (right-aligned), card title area, or matrix quadrants

### Gradient Scheme (if needed, using SVG syntax)

```xml
<!-- Title gradient -->
<linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#[primary]"/>
  <stop offset="100%" stop-color="#[secondary accent]"/>
</linearGradient>

<!-- Background decorative gradient (note: rgba forbidden, use stop-opacity) -->
<radialGradient id="bgDecor" cx="80%" cy="20%" r="50%">
  <stop offset="0%" stop-color="#[primary]" stop-opacity="0.15"/>
  <stop offset="100%" stop-color="#[primary]" stop-opacity="0"/>
</radialGradient>
```

---

## IV. Typography System

### Font Plan

> Strategist should select a font preset based on content characteristics, or customize the font combination
> Preset descriptions: P1=Modern business/tech | P2=Government docs | P3=Culture/arts | P4=Traditional/conservative | P5=English-primary

**Recommended preset**: [Fill in preset code]

| Role | Chinese | English | Fallback |
| ---- | ------- | ------- | -------- |
| **Title** | [font name] | [font name] | [font name] |
| **Body** | [font name] | [font name] | [font name] |
| **Code** | - | Consolas | Monaco |
| **Emphasis** | [font name] | [font name] | [font name] |

**Font stack**: `[Fill in CSS font-family string]`

### Font Size Hierarchy

> **Design principle**: Use body font size as baseline (1x), derive other levels proportionally
> **Unit convention**: Use px uniformly (SVG native unit) to avoid pt/px conversion errors
> **Selection principle**: Font size is based on **content density**, not design style

**Baseline**: Body font size = [fill in]px (choose 18-24px based on content density)

| Purpose | Ratio | 24px baseline (relaxed) | 18px baseline (dense) | Weight |
| ------- | ----- | ---------------------- | -------------------- | ------ |
| Cover title | 2.5-3x | 60-72px | 45-54px | Bold |
| Chapter title | 2-2.5x | 48-60px | 36-45px | Bold |
| Content title | 1.5-2x | 36-48px | 27-36px | Bold |
| Subtitle | 1.2-1.5x | 29-36px | 22-27px | SemiBold |
| **Body content** | **1x** | **24px** | **18px** | Regular |
| Annotation | 0.75-0.85x | 18-20px | 14-15px | Regular |
| Page number/date | 0.55-0.65x | 13-16px | 10-12px | Regular |

> **Tip**: Dense content (6+ points per page) use 18px; relaxed content (3-5 points per page) use 24px

---

## V. Layout Principles

### Page Structure

- **Header area**: [Height and content description]
- **Content area**: [Height and content description]
- **Footer area**: [Height and content description]

### Common Layout Modes

| Mode | Suitable Scenarios |
| ---- | ----------------- |
| **Single column centered** | Covers, conclusions, key points |
| **Left-right split (5:5)** | Comparisons, dual concepts |
| **Left-right split (4:6)** | Image-text mix |
| **Top-bottom split** | Processes, timelines |
| **Three/four column cards** | Feature lists, team introductions |
| **Matrix grid** | Comparative analysis, classifications |

### Expanded Layout Variants (v1.2)

| Layout Variant | Suitable Scenarios | Key Slots |
| -------------- | ------------------ | --------- |
| **executive-summary** | Core findings overview | 3-5 numbered insight cards |
| **priority-matrix** | Impact × Urgency ranking | P0/P1/P2 quadrants with badge color coding |
| **era-comparison** | Past→Present→Future stages | 3-column status + bullet list |
| **risk-quadrant** | Risk factor visualization | 4 risk cards with level badges |
| **hero-metric-duo** | Side-by-side key numbers | Two large metrics + comparison label |
| **chapter-nav-table** | Data-dense comparison tables | Table + chapter breadcrumb + cell badges |
| **action-timeline** | Phased roadmap (short/mid/long) | 3-4 nodes with period, title, actions |
| **action-checklist** | Action items with timelines | Time badge + action description |
| **radar-profile** | Multi-dimension capability assessment | Radar chart + dimension labels + summary |
| **funnel-flow** | Process/conversion stages | 3-5 funnel levels with conversion rates |
| **data-disclaimer** | Source & limitation declaration | Source + limitations + assumptions + next steps |

### Chrome Components (Mandatory for Analysis Decks)

Every inner page (cover and section-divider excluded) MUST include at least 3 of the following chrome elements:

| Component | Specification | Position |
| --------- | ------------- | -------- |
| **Accent line** | Width 24-32px, height 2-3px, accent color | Above page title |
| **Page counter** | Format: "03 / 26 · Chapter Name", 10-12px, secondary text color | Top-right or bottom-center |
| **Report title footer** | Full report name, 10-11px, secondary text color | Bottom-right or bottom-left |
| **Chapter label** | "PART 01 · Chapter Name", 12px, accent color | Subtitle area |
| **Source caption** | "资料来源: ...", 10px, secondary text color | Below chart/matrix |

### Insight Presentation Variants

Every page MUST contain one "so what" insight element. Choose based on information density:

| Variant | Position | Style | Best For |
| ------- | -------- | ----- | -------- |
| **Insight Strip** | Page bottom (距底边 40-50px) | Light background (surface) or accent left-border 3px | Standard pages |
| **Insight Card** | Content area (below chart/table) | Rounded rect, surface bg, accent left-border 4px, padding 12-16px | High-density data pages |
| **Inline Highlight** | Within body text | Bold text, accent color | Space-constrained pages |

### Spacing Specification

> Strategist may adjust based on project needs

| Element | Recommended Range | Current Project |
| ------- | ---------------- | --------------- |
| Card gap | 20-32px | [fill in] |
| Content block gap | 24-40px | [fill in] |
| Card padding | 20-32px | [fill in] |
| Card border radius | 8-16px | [fill in] |
| Icon-text gap | 8-16px | [fill in] |
| Single-row card height | 530-600px | [fill in] |
| Double-row card height | 265-295px each | [fill in] |
| Three-column card width | 360-380px each | [fill in] |

---

## VI. Icon Usage Specification

### Source

- **Built-in icon library**: `templates/icons/` (6700+ icons across three libraries)
- **Usage method**: Placeholder format `{{icon:category/icon-name}}`

### Recommended Icon List (fill as needed)

| Purpose | Icon Path | Page |
| ------- | --------- | ---- |
| [example] | `{{icon:interface/check-circle}}` | Slide XX |

---

## VII. Visualization Reference List

> When the presentation includes data visualization or infographic-style structured information design, Strategist selects visualization types from `templates/charts/charts_index.json` and lists them here for the Executor to reference. The path remains under `templates/charts/` for backward compatibility.

### Chart Type Guide (v1.2)

| Chart Type | Best Scenario | Mandatory Elements | Anti-patterns |
| ---------- | ------------- | ------------------ | ------------- |
| **Column Clustered** | Multi-entity same-dimension comparison | Data labels on top, consistent bar width, 50% gap | 3D columns, rainbow colors |
| **Bar Stacked** | Composition + comparison (≤5 categories) | Total label, category limit 5, theme-color order | Too many stacks, no total |
| **Pie / Doughnut** | Single-entity composition (5-7 slices max) | Percentage + category name, clockwise by size | >7 slices, 3D pie, no labels |
| **Radar** | Multi-dimension capability assessment | 3-6 dimensions, 20-30% fill opacity, ≤3 series | >8 dimensions, opaque fill |
| **Line** | Time-series trends | 2-3pt line width, clear markers, ≤3 trend lines | >3 lines, no markers |
| **Waterfall** | Increment/decrement breakdown | Up=green, down=red, total=primary color | Missing total bar |
| **Funnel** | Process conversion (3-5 stages) | Conversion rate label,递减色深 | >5 stages |
| **Scatter / Bubble** | Distribution/correlation analysis | Trend line if applicable, bubble limit 20 | Too many bubbles |
| **Heatmap** | Matrix density / correlation | Gradient (light→primary), value labels | Rainbow gradient |
| **Combo (Column + Line)** | Absolute value + rate dual-metric | Column=surface+primary, line=accent | Dual Y-axes (misleading) |

**Chart Theming Rules**:
- Color series order: primary → accent → secondary_accent → badge_info → badge_warning → badge_leading
- Background: bg (#FFFFFF) or surface (#F7FAFC)
- Grid lines: border color (#E2E8F0), 0.5pt
- All charts MUST have: Title, Data Labels (where readable), Axis Labels (with units), Legend, Source Caption

### Visualization Assignment Table

| Visualization Type | Reference Template | Used In |
| ------------------ | ------------------ | ------- |
| [e.g. grouped_bar_chart] | `templates/charts/grouped_bar_chart.svg` | Slide 05 |

---

## VIII. Image Resource List (if needed)

| Filename | Dimensions | Ratio | Purpose | Type | Status | Generation Description |
| -------- | --------- | ----- | ------- | ---- | ------ | --------------------- |
| cover_bg.png | {canvas_info['dimensions']} | [ratio] | Cover background | [Background/Photography/Illustration/Diagram/Decorative] | [Pending/Existing/Placeholder] | [AI generation prompt] |

**Status descriptions**:

- **Pending** - Needs AI generation, provide detailed description
- **Existing** - User already has image, place in `images/`
- **Placeholder** - Not yet processed, use dashed border placeholder in SVG

**Type descriptions** (used by Image_Generator for prompt strategy selection):

- **Background** - Full-page background for covers/chapters, reserve text area
- **Photography** - Real scenes, people, products, architecture
- **Illustration** - Flat design, vector style, cartoon, concept diagrams
- **Diagram** - Flowcharts, architecture diagrams, concept maps
- **Decorative** - Partial decorations, textures, borders, dividers

---

## IX. Content Outline

### Part 1: [Chapter Name]

#### Slide 01 - Cover

- **Layout**: Full-screen background image + centered title
- **Title**: [Main title]
- **Subtitle**: [Subtitle]
- **Info**: [Author / Date / Organization]

#### Slide 02 - [Page Name]

- **Layout**: [Choose layout mode]
- **Title**: [Page title]
- **Visualization**: [visualization_type] (see VII. Visualization Reference List)
- **Content**:
  - [Point 1]
  - [Point 2]
  - [Point 3]

> **Visualization field**: Only add when the page includes data visualization or structured infographic elements. Visualization type must be listed in section VII.

---

[Strategist continues adding more pages based on source document content and page count planning...]

---

## X. Speaker Notes Requirements

Generate corresponding speaker note files for each page, saved to the `notes/` directory:

- **File naming**: Match SVG names, e.g., `01_cover.md`
- **Content includes**: Script key points, timing cues, transition phrases

---

## XI. Technical Constraints Reminder

### SVG Generation Must Follow:

1. viewBox: `{canvas_info['viewbox']}`
2. Background uses `<rect>` elements
3. Text wrapping uses `<tspan>` (`<foreignObject>` FORBIDDEN)
4. Transparency uses `fill-opacity` / `stroke-opacity`; `rgba()` FORBIDDEN
5. FORBIDDEN: `clipPath`, `mask`, `<style>`, `class`, `foreignObject`
6. FORBIDDEN: `textPath`, `animate*`, `script`
7. `marker-start` / `marker-end` conditionally allowed: `<marker>` must be in `<defs>`, `orient="auto"`, shape must be triangle / diamond / circle (see shared-standards.md §1.1)

### PPT Compatibility Rules:

- `<g opacity="...">` FORBIDDEN (group opacity); set on each child element individually
- Image transparency uses overlay mask layer (`<rect fill="bg-color" opacity="0.x"/>`)
- Inline styles only; external CSS and `@font-face` FORBIDDEN

---

## XII. Data Disclaimer (Mandatory for Analysis Decks)

> When source material contains self-reported data, undisclosed fields, or estimated values, a data disclaimer slide or footer MUST be included to maintain consulting credibility.

**Trigger conditions** (include if ANY apply):
- Source material is self-assessed / questionnaire-based
- Key financial figures are undisclosed or estimated
- System counts / personnel numbers are self-reported
- Comparative benchmarks are industry-generic (not case-validated)

**Standard structure**:
1. **Data Source**: Explicitly state origin (e.g., "三家水务公司2026年5月填报的信息化现状表")
2. **Known Limitations**: List gaps (e.g., "清源华衍年度IT预算未披露，部分字段未填写")
3. **Unverified Assumptions**: State estimates used (e.g., "重复建设浪费按行业基准40-60%估算")
4. **Next Steps for Validation**: Suggest follow-up research

**Placement options**:
- **Dedicated slide** (recommended for formal reports): Full-page disclaimer as final slide
- **Footer annotation** (for concise decks): 9-10px text at bottom of relevant data pages
