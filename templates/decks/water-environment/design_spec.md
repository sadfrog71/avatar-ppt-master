---
deck_id: water-environment
kind: deck
summary: Generic water utility, environmental operations, sustainability reporting, AI operations, and project proposal decks.
canvas_format: ppt169
page_count: 5
primary_color: "#00467F"
---

# Water Environment Template - Design Specification

> Suitable for water utility operations, environmental governance, digital transformation, smart water, sustainability, ESG, project proposals, and executive decision materials.
> This is a generic public template. It contains only vector SVG assets and placeholder text.

---

## I. Template Overview

| Property | Description |
| --- | --- |
| **Template Name** | water-environment |
| **Use Cases** | Water utility, environmental operations, sustainability reporting, AI operations, project proposals, executive briefings |
| **Design Tone** | Clean, reliable, technical, environmental, executive |
| **Theme Mode** | Deep water blue, clean cyan, ecological green, white content field |

---

## II. Canvas Specification

| Property | Value |
| --- | --- |
| **Format** | Standard 16:9 |
| **Dimensions** | 1280 x 720 px |
| **viewBox** | `0 0 1280 720` |
| **Page Margins** | Left/Right 72px, Top 72px, Bottom 56px |
| **Safe Area** | x: 72-1208, y: 72-664 |

---

## III. Color Scheme

### Primary Colors

| Role | Color Value | Usage |
| --- | --- | --- |
| **Water Blue** | `#00467F` | Cover, section headers, primary navigation |
| **Deep Blue** | `#062A45` | Dark backgrounds and title contrast |
| **Cyan Accent** | `#19A7CE` | Data highlights, lines, icons |
| **Eco Green** | `#46B36B` | Sustainability and positive signals |

### Neutral Colors

| Role | Color Value | Usage |
| --- | --- | --- |
| **Paper White** | `#F7FBFD` | Page base and content panels |
| **Ink** | `#1B2B34` | Main text |
| **Muted Text** | `#5A6B75` | Secondary copy |
| **Line Gray** | `#D6E2E8` | Dividers and light grid |

---

## IV. Typography System

### Font Stack

**Primary Font Stack**: `"Microsoft YaHei", "PingFang SC", Arial, sans-serif`

### Font Size Hierarchy

| Level | Usage | Size | Weight | Color |
| --- | --- | --- | --- | --- |
| H1 | Cover title | 56px | Bold | #FFFFFF |
| H2 | Page heading | 34px | Bold | #00467F |
| H3 | Section title | 22px | Bold | #1B2B34 |
| P | Body text | 17px | Regular | #5A6B75 |
| Label | Navigation / metadata | 13px | Medium | #5A6B75 |

---

## V. Page Structure

- **Top-left anchor**: page title with a short cyan rule.
- **Right-side water arc**: soft vector curve that gives the deck a water/environment identity.
- **Content field**: white or near-white working area for dense executive content.
- **Footer line**: page number, section label, and thin environmental accent.

---

## VI. Page Types

### 1. Cover Page (`01_cover.svg`)
- Deep water gradient background with abstract contour lines.
- Main title, subtitle, organization, presenter, and date placeholders.
- Large curved water form on the right side for visual identity.

### 2. Table of Contents (`02_toc.svg`)
- Four agenda items arranged as a clean operating roadmap.
- Each item has a number, title, and short description placeholder.

### 3. Chapter Page (`02_chapter.svg`)
- Dark blue chapter divider with large chapter number and section title.
- Water contour lines and cyan-green accent marks.

### 4. Content Page (`03_content.svg`)
- Executive report layout with KPI cards, body area, and chart placeholder.
- Supports operations metrics, project comparison, AI platform explanation, and governance recommendations.

### 5. Ending Page (`04_ending.svg`)
- Closing page with thank-you message and contact placeholders.
- Calm white field with blue/green footer arc.

---

## VII. SVG Page Roster

| File | Role | Description |
| --- | --- | --- |
| `01_cover.svg` | cover | Title slide with water environment identity |
| `02_toc.svg` | toc | Agenda / table of contents |
| `02_chapter.svg` | chapter | Chapter divider |
| `03_content.svg` | content | Main content page |
| `04_ending.svg` | ending | Closing page |

---

## VIII. Layout Patterns

### Executive Metrics
- Use 3 to 4 KPI cards with clear values and short labels.
- Use cyan for neutral metrics and green for positive environmental impact.

### Operations Dashboard
- Combine a left insight column with a right chart or process view.
- Keep text concise and use dividers to support scanning.

### Project Proposal
- Use a statement headline, 2 to 3 supporting modules, and one action-oriented takeaway.

---

## IX. Spacing Guidelines

| Property | Value | Description |
| --- | --- | --- |
| **Base Unit** | 4px | All positions align to a 4px grid |
| **Module Gap** | 24px | Gap between major content modules |
| **Card Gap** | 18px | Gap between KPI or agenda cards |
| **Inner Padding** | 24px | Padding inside content cards |

---

## X. SVG Technical Constraints

### Mandatory Rules

1. Use inline SVG attributes only.
2. Use hex colors plus `fill-opacity` / `stroke-opacity`.
3. Use `<linearGradient>` and `<pattern>` only inside `<defs>`.
4. Keep all graphics vector-based; do not reference external bitmap images.

### Forbidden Elements

- `mask`
- `<style>` and `class`
- `foreignObject`
- `textPath`
- `animate`, `animateTransform`, `set`
- `rgba()` color format
- `<g opacity="...">`

---

## XI. Placeholder Specification

| Placeholder | Description |
| --- | --- |
| `{{TITLE}}` | Presentation main title |
| `{{SUBTITLE}}` | Subtitle |
| `{{AUTHOR}}` | Presenting organization |
| `{{PRESENTER}}` | Presenter |
| `{{DATE}}` | Date |
| `{{CHAPTER_NUM}}` | Chapter number |
| `{{CHAPTER_TITLE}}` | Chapter title |
| `{{PAGE_TITLE}}` | Content page title |
| `{{TOC_ITEM_N_TITLE}}` | TOC item title |
| `{{TOC_ITEM_N_DESC}}` | TOC item description |
| `{{STAT_N}}` | KPI number |
| `{{STAT_N_LABEL}}` | KPI label |
| `{{CONTENT_AREA}}` | Main content area |
| `{{TAKEAWAY}}` | Executive takeaway |
| `{{THANK_YOU}}` | Closing message |
| `{{CONTACT_INFO}}` | Contact information |

---

## XII. Usage Notes

1. This deck is public-safe and generic by design.
2. Keep water and environmental topics visually clean, not decorative-heavy.
3. For corporate-specific work, add logos and brand assets only inside the generated project, not in this public template.
