# 项目文件作用说明

本文件由 `scripts/update-project-docs.mjs` 生成,用于快速理解当前项目工作树下每个源码文件的主要作用。`output/` 是生成产物目录,不纳入源码文件清单。

```text
.
|-- .githooks/
|   `-- pre-commit - 本地 Git pre-commit hook,提交前重生成 README、ADR 和文件作用说明并自动 stage。
|-- assets/
|   |-- screenshot-backgrounds/
|   |   |-- style-a/
|   |   |   |-- dune.webp - Style A 沙丘截图背景资源。
|   |   |   |-- forest-ink.webp - Style A 森林墨截图背景资源。
|   |   |   |-- indigo-porcelain.webp - Style A 靛蓝瓷截图背景资源。
|   |   |   |-- kraft-paper.webp - Style A 牛皮纸截图背景资源。
|   |   |   `-- monocle-classic.webp - Style A 墨水经典截图背景资源。
|   |   `-- style-b/
|   |       |-- ikb-dot-gradient.webp - Style B IKB 蓝截图背景资源。
|   |       |-- lemon-green-dot-shadow.webp - Style B 柠檬绿截图背景资源。
|   |       |-- lemon-grid.webp - Style B 柠檬黄截图背景资源。
|   |       `-- safety-orange-halftone.webp - Style B 安全橙截图背景资源。
|   |-- motion.min.js - 浏览器端 Motion One 动效 runtime,由渲染器复制到最终产物。
|   `-- template-swiss.html - 静态 PPT HTML 外壳模板,包含 CSS、背景、翻页、导航、预览控制器和动效入口。
|-- docs/
|   |-- ADR.md - 架构决策记录,描述当前生成链路和组件化边界。
|   `-- project-files.md - 项目文件作用说明,由脚本根据当前文件列表生成。
|-- examples/
|   `-- component-decks/
|       |-- ai-ops-review.jsx - AI 运营复盘示例 deck,演示技术/运营复盘主题的页面组合。
|       |-- all-layouts-showcase.jsx - 全部布局总览示例 deck,顺序渲染 A01-A10、S01-S22、S08 登记扩展和组件维度展示页。
|       |-- climate-field-report.jsx - 城市微气候田野报告示例 deck,演示生态/田野主题的页面组合。
|       |-- retail-launch-brief.jsx - 零售新品上市简报示例 deck,演示消费/上市主题的页面组合。
|       `-- swiss-demo.jsx - 组件选项机制 demo deck,可用环境变量切换主题和字体。
|-- references/
|   |-- checklist.md - 原项目执行检查清单,包含 Style B 生成和 QA 约束。
|   |-- component-workflow.md - 组件选项工作流参考,说明新增选项和 subagent 测试要求。
|   |-- image-prompts.md - 图片生成提示词参考,包含 Style A 与 Style B 的图像槽位要求。
|   |-- layouts-swiss.md - Style B Swiss 原始布局说明,登记 S01-S22 与地图扩展使用方式。
|   |-- layouts.md - Style A 电子杂志原始布局说明,登记 A01-A10 的历史来源。
|   |-- screenshot-framing.md - 截图入版规范,说明不同风格的背景、裁切、阴影和留边规则。
|   |-- swiss-layout-lock.md - Style B Swiss 布局锁定规则,约束只能使用登记布局和扩展。
|   |-- swiss-map-component.md - Style B S08 地图插槽扩展说明,定义点位、关系线和控制区契约。
|   |-- themes-swiss.md - Style B Swiss 主题色参考,定义 4 套主题与使用边界。
|   `-- themes.md - Style A 电子杂志主题色参考。
|-- scripts/
|   |-- render-deck.jsx - 渲染 CLI 入口,把 deck 配置文件输出成静态 HTML。
|   |-- update-project-docs.mjs - 文档同步脚本,更新 README、ADR 和项目文件作用说明。
|   |-- validate-layout-showcase.mjs - 布局总览覆盖校验器,确保 all-layouts-showcase 穷举 A01-A10、canonical S01-S22 和 Style B 登记扩展。
|   `-- validate-swiss-deck.mjs - 静态 deck 校验器,检查合法 layout、图片槽位和禁用模式。
|-- src/
|   |-- components/
|   |   |-- cards/
|   |   |   |-- Card.jsx - 卡片组件。
|   |   |   `-- index.jsx - 卡片组件。
|   |   |-- charts/
|   |   |   |-- HBarChart.jsx - 图表组件,负责条形图等数据可视化块。
|   |   |   `-- index.jsx - 图表组件,负责条形图等数据可视化块。
|   |   |-- decorations/
|   |   |   |-- Icon.jsx - 装饰组件,包含图标和分割线等视觉元素。
|   |   |   |-- index.jsx - 装饰组件,包含图标和分割线等视觉元素。
|   |   |   `-- Rule.jsx - 装饰组件,包含图标和分割线等视觉元素。
|   |   |-- diagrams/
|   |   |   |-- index.jsx - 图解组件,负责地图、关系图和系统图等结构表达。
|   |   |   `-- RelationMap.jsx - 图解组件,负责地图、关系图和系统图等结构表达。
|   |   |-- magazine/
|   |   |   |-- A01HeroCover.jsx - Hero Cover 页面布局组件,对应 A01。
|   |   |   |-- A02ActDivider.jsx - Act Divider 页面布局组件,对应 A02。
|   |   |   |-- A03BigNumbersGrid.jsx - Big Numbers Grid 页面布局组件,对应 A03。
|   |   |   |-- A04QuoteImage.jsx - Quote + Image 页面布局组件,对应 A04。
|   |   |   |-- A05ImageGrid.jsx - Image Grid 页面布局组件,对应 A05。
|   |   |   |-- A06Pipeline.jsx - Pipeline 页面布局组件,对应 A06。
|   |   |   |-- A07HeroQuestion.jsx - Hero Question 页面布局组件,对应 A07。
|   |   |   |-- A08BigQuote.jsx - Big Quote 页面布局组件,对应 A08。
|   |   |   |-- A09BeforeAfter.jsx - Before / After 页面布局组件,对应 A09。
|   |   |   |-- A10LeadImageText.jsx - Lead Image + Side Text 页面布局组件,对应 A10。
|   |   |   |-- index.jsx - A01-A10 组件统一导出口,供 LAYOUT_OPTIONS 引用。
|   |   |   `-- primitives.jsx - 电子杂志布局共享基础件,包含 slide 外壳、页眉、页脚、图片框和标题块。
|   |   |-- media/
|   |   |   |-- ImageGrid.jsx - 媒体组件,负责图片框、截图槽位和图片网格。
|   |   |   |-- index.jsx - 媒体组件,负责图片框、截图槽位和图片网格。
|   |   |   `-- MediaFrame.jsx - 媒体组件,负责图片框、截图槽位和图片网格。
|   |   |-- metrics/
|   |   |   |-- index.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |   |-- MetricRow.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |   `-- StatGrid.jsx - 指标组件,负责 KPI 行、数据卡和数字网格。
|   |   |-- shell/
|   |   |   |-- Background.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Canvas.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Chrome.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- Footer.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   |-- index.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |   `-- SlideShell.jsx - 页面外壳组件,负责 slide、画布、页眉、页脚和背景装饰。
|   |   |-- swiss/
|   |   |   |-- Closing.jsx - 收尾页组件,对应 SWISS-CLOSING-ASCII。
|   |   |   |-- Cover.jsx - 封面组件,对应 SWISS-COVER-ASCII。
|   |   |   |-- HBar.jsx - 横向柱状排行组件,对应 S07。
|   |   |   |-- ImageHero.jsx - 图片主视觉页组件,对应 S22。
|   |   |   |-- index.jsx - Swiss 组件统一导出口,供 LAYOUT_OPTIONS 引用。
|   |   |   |-- KpiTower.jsx - KPI 塔组件,对应 S06。
|   |   |   |-- primitives.jsx - Swiss 组件共享基础件,包含 slide 外壳、画布卡、页眉、图标和 KPI 行。
|   |   |   |-- S01IndexCover.jsx - Index Cover 正文布局组件,对应 S01。
|   |   |   |-- S03SplitStatement.jsx - Split Statement 正文布局组件,对应 S03。
|   |   |   |-- S05ThreeLayers.jsx - Three Layers 正文布局组件,对应 S05。
|   |   |   |-- S08DuoCompare.jsx - Duo Compare 正文布局组件,对应 S08。
|   |   |   |-- S08Map.jsx - Swiss Map Component 地图插槽扩展,仍对应 S08。
|   |   |   |-- S09DotMatrixStatement.jsx - Dot Matrix Statement 正文布局组件,对应 S09。
|   |   |   |-- S10SplitClosing.jsx - Split Closing 正文布局组件,对应 S10。
|   |   |   |-- S11HorizontalTimeline.jsx - Horizontal Timeline 正文布局组件,对应 S11。
|   |   |   |-- S12ManifestoBanner.jsx - Manifesto + Ink Banner 正文布局组件,对应 S12。
|   |   |   |-- S13ThreeForces.jsx - Three Forces 正文布局组件,对应 S13。
|   |   |   |-- S14LoopForm.jsx - Loop Form 正文布局组件,对应 S14。
|   |   |   |-- S15MatrixHeroStat.jsx - Matrix + Hero Stat 正文布局组件,对应 S15。
|   |   |   |-- S16MultiCardBrief.jsx - Multi-card Brief 正文布局组件,对应 S16。
|   |   |   |-- S17SystemDiagram.jsx - System Diagram 正文布局组件,对应 S17。
|   |   |   |-- S18WhyNow.jsx - Why Now 正文布局组件,对应 S18。
|   |   |   |-- S19FourCards.jsx - Four Cards 正文布局组件,对应 S19。
|   |   |   |-- S20StackedLedger.jsx - Stacked KPI Ledger 正文布局组件,对应 S20。
|   |   |   |-- S21TechSpec.jsx - Tech Spec Sheet 正文布局组件,对应 S21。
|   |   |   |-- SixCells.jsx - 六宫格组件,对应 S04。
|   |   |   `-- Timeline.jsx - 纵向时间线 + KPI 组件,对应 S02。
|   |   |-- text/
|   |   |   |-- index.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   |-- KickerTitle.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   |-- MetaRow.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |   `-- QuoteBlock.jsx - 文本表达组件,负责 kicker、标题、引用和 meta 信息。
|   |   |-- timelines/
|   |   |   |-- index.jsx - 时间线与流程组件。
|   |   |   `-- Pipeline.jsx - 时间线与流程组件。
|   |   `-- index.jsx - React 生成层源码。
|   |-- tokens/
|   |   |-- fonts.js - 组件生成层 token 选项。
|   |   |-- index.js - 组件生成层 token 选项。
|   |   |-- motion.js - 组件生成层 token 选项。
|   |   |-- spacing.js - 组件生成层 token 选项。
|   |   |-- themes.js - 组件生成层 token 选项。
|   |   `-- typography.js - 组件生成层 token 选项。
|   |-- options.jsx - 选项注册表,集中登记主题色、字体组合、字号、间距、动效和页面版式。
|   `-- renderDeck.jsx - 核心渲染器,把 React slides 注入模板并替换 CSS 变量、注入预览控制器选项。
|-- .gitignore - 忽略本地依赖、生成产物和系统临时文件。
|-- AGENTS.md - 项目级 Agent 记忆,记录本仓库长期遵守的实现约束。
|-- package-lock.json - npm 依赖锁定文件。
|-- package.json - npm 脚本和 React/tsx 依赖声明。
|-- README.md - 项目入口说明,包含快速开始、当前选项和文档索引。
`-- SKILL.md - 给 Agent 使用的 skill 说明,定义 PPT 生成流程和约束。
```
