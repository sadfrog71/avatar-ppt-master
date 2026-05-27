# ADR

本文件由 `scripts/update-project-docs.mjs` 生成,记录当前项目已经采用的架构决策。

## ADR-001: 最终产物保持为静态 HTML

最终交付仍是 `index.html`、`assets/motion.min.js` 和图片资源。React 只作为生成层使用,不进入浏览器运行时。

## ADR-002: 可变部分使用登记选项多选一

`theme` 从 `THEME_OPTIONS` 选择,`fontSet` 从 `FONT_OPTIONS` 选择,每页通过 `slide(layoutKey, props)` 从 `LAYOUT_OPTIONS` 选择。Agent 不直接手写自由 HTML 页面。

## ADR-003: 模板负责浏览器运行时

`assets/template-swiss.html` 负责 CSS 视觉系统、背景、翻页、导航、预览控制器和动效入口。React 组件只生成注入到 `#deck` 内的 slide markup。

## ADR-004: 输出目录是生成物

`output/` 用于 demo、验证 deck 和截图产物,已加入 `.gitignore`,不作为源码提交。

## ADR-005: 提交前同步项目文档

`.githooks/pre-commit` 会运行 `scripts/update-project-docs.mjs`,并 stage `README.md`、`docs/ADR.md`、`docs/project-files.md`。

## ADR-006: Swiss 布局组件按文件拆分

每个 Swiss 页面布局组件独立放在 `src/components/swiss/*.jsx`,共享基础件放在 `src/components/swiss/primitives.jsx`,统一导出放在 `src/components/swiss/index.jsx`。`src/options.jsx` 只负责把 layout key 登记到组件。

## ADR-007: 原始 Swiss 正文布局使用 canonical key

原始 Swiss `S01` 到 `S22` 正文布局统一登记为 `s01` 到 `s22`。旧的语义 key 仅保留给已有示例兼容,新的正文页面优先使用 canonical key。

## ADR-008: 提交前刷新全布局总览

`.githooks/pre-commit` 会运行 `npm run showcase:update`,先确认 `examples/component-decks/all-layouts-showcase.jsx` 覆盖全部 canonical 布局和 Style B 登记扩展,再重生成并校验 `output/all-components-showcase/ppt/index.html`。

## ADR-009: Style B 参考资源纳入源码

原项目 Style B / Swiss 的主题、布局锁定、地图扩展、图片提示词、截图入版规则和 4 套截图背景资源保留在 `references/` 与 `assets/screenshot-backgrounds/style-b/`。主题是 deck 级多选一,布局仍是每页从 `S01` 到 `S22` 多选一;`s08Map` 只是 S08 插槽扩展,不新增布局编号。

## ADR-010: Style A 原始布局补入统一 registry

原项目 Style A / 电子杂志风的 10 个原始布局登记为 `a01` 到 `a10`,输出 `data-layout="A01"` 到 `A10`。这些布局和 Swiss `s01` 到 `s22` 使用同一个 `LAYOUT_OPTIONS` 与同一个静态模板渲染,当前不再恢复第二套 HTML 运行时。

## ADR-011: token 与组件按组合维度分类

`src/tokens/` 存放主题、字体、字号、间距和动效选项。`src/components/` 下按组合职责分为 `shell/`、`text/`、`media/`、`metrics/`、`charts/`、`timelines/`、`cards/`、`decorations/`、`diagrams/`。历史布局目录 `magazine/` 与 `swiss/` 继续保留为 layout preset,但内部优先复用这些分类组件。

## ADR-012: demo 同时覆盖布局穷举和运行时切换

`examples/component-decks/all-layouts-showcase.jsx` 负责穷举全部登记布局,并追加组件维度展示页。主题、字体、字号、间距这类全局 token 由 `assets/template-swiss.html` 的预览侧边栏切换。明暗底色不再作为单独预览选项,而是归入 theme 的 `surface` / `inverse` 角色;布局内被高亮的 item 统一使用 theme 的 `focus-*` 角色。动效跟随布局组件,不作为预览选项。
