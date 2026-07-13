# Avatar PPT Master

An internal presentation-generation skill derived from `dashi-ppt`. This edition focuses on content planning, page composition, theme selection, and water-industry reporting.

It converts Markdown, proposals, research notes, and structured requirements into offline HTML decks, with PDF and editable PPTX export.

## Positioning

- Designed for internal reports, proposals, project reviews, training, and research decks.
- Plans the narrative and the role of each page before selecting a visual layout.
- Supports local media staging and offline deliverables.
- Requires users to follow their organization's data policy and the policy of the connected AI model.

## Installation

### Codex

```bash
git clone https://github.com/sadfrog71/avatar-ppt-master.git
mkdir -p ~/.codex/skills/avatar-ppt-master
cp -R avatar-ppt-master/skills/avatar-ppt-master/. ~/.codex/skills/avatar-ppt-master/
```

### Claude Code

```bash
git clone https://github.com/sadfrog71/avatar-ppt-master.git
mkdir -p ~/.claude/skills/avatar-ppt-master
cp -R avatar-ppt-master/skills/avatar-ppt-master/. ~/.claude/skills/avatar-ppt-master/
```

Restart the agent session after installation. The skill name is `avatar-ppt-master`.

## Example

```text
Use avatar-ppt-master to turn this proposal into a 10-slide internal management deck.
Use theme13, emphasize risks, delivery milestones, and decisions, and export an editable PPTX.
```

## Theme 13: Water Environment

`theme13` is a blue-green operational style for water operations, environmental management, project proposals, and data reviews. It includes 24 page components covering covers, agendas, section dividers, KPI dashboards, risk matrices, roadmaps, architecture diagrams, operational analysis, and closing pages.

## Requirements

- Node.js 20+
- npm
- Chromium, Chrome, or a compatible browser for preview and export

## Upstream and License

This project is derived from [chuspeeism/dashiAI-ppt-skill](https://github.com/chuspeeism/dashiAI-ppt-skill) and retains upstream attribution. The main project is licensed under [AGPL-3.0](LICENSE).

The [`html-deck-to-pptx`](skills/avatar-ppt-master/project/packages/html-deck-to-pptx) subpackage retains its separate MIT license. Original copyrights and third-party licenses remain with their respective owners.
