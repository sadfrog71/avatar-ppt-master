# ADR

本文件由 `scripts/update-project-docs.mjs` 生成,记录当前项目已经采用的架构决策。

## ADR-001: 最终产物保持为静态 HTML

最终交付仍是 `index.html`、`assets/motion.min.js` 和图片资源。React 只作为生成层使用,不进入浏览器运行时。

## ADR-002: 可变部分使用登记选项多选一

`theme` 从 `THEME_OPTIONS` 选择,`fontSet` 从 `FONT_OPTIONS` 选择,每页通过 `slide(layoutKey, props)` 从 `LAYOUT_OPTIONS` 选择。Agent 不直接手写自由 HTML 页面。

## ADR-003: 模板负责浏览器运行时

`assets/template-swiss.html` 负责 CSS 视觉系统、背景、翻页、导航和动效入口。React 组件只生成注入到 `#deck` 内的 slide markup。

## ADR-004: 输出目录是生成物

`output/` 用于 demo、验证 deck 和截图产物,已加入 `.gitignore`,不作为源码提交。

## ADR-005: 提交前同步项目文档

`.githooks/pre-commit` 会运行 `scripts/update-project-docs.mjs`,并 stage `README.md`、`docs/ADR.md`、`docs/project-files.md`。
