# Execution Lock

> Machine-readable execution contract. Executor MUST `read_file` this before every SVG page. Values NOT listed here must NOT appear in SVGs. For design narrative (rationale, audience, style), see `design_spec.md`.
>
> After SVG generation begins, this file is the canonical source for color / font / icon / image values. Modifications should go through `scripts/update_spec.py` so both this file and the generated SVGs stay in sync.

## canvas
- viewBox: 0 0 1280 720
- format: PPT 16:9

## colors
- bg: #FFFFFF
- primary: #1A56DB
- secondary: #3B82F6
- accent: #0EA5E9
- text: #111827
- text_secondary: #6B7280
- text_tertiary: #9CA3AF
- border: #E5E7EB
- bg_secondary: #F0F5FF
- danger: #DC2626
- danger_bg: #FEF2F2
- success: #16A34A
- success_bg: #F0FDF4

## typography
- font_family: "Microsoft YaHei", Arial, sans-serif
- title: 36
- subtitle: 22
- body: 18
- annotation: 13
- page_number: 11

## icons
- library: chunk
- inventory: []

> No icon library lookup needed — use simple inline SVG shapes only.

## images
> No images in this deck.

## forbidden
- Mixing icon libraries
- rgba()
- <style>, class, <foreignObject>, textPath, @font-face, <animate*>, <script>, <iframe>, <symbol>+<use>
- <g opacity> (set opacity on each child element individually)
