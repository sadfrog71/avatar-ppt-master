# Dashi PPT Skill

一个用 React 组件生成静态 HTML 横向翻页 PPT 的本地 skill。当前只暴露已通过接入验收的 Claude Design 主题。

当前版本: `0.1.1`

最终产物是普通静态文件:

```text
output/my-deck/ppt/
├── index.html
├── assets/
└── images/
```

## 当前结构

- `themePack`: 当前支持 `theme01`、`theme02`、`theme03`、`theme04`、`theme07`、`theme08`、`theme09`、`theme10`、`theme11`、`theme12`
- 页面组件: `src/components/themes/theme*/`,页面 key 使用 `theme01_page001` 这类格式
- 主题登记: `src/components/themes/generated-metadata.js`
- 布局登记: `src/options.jsx`
- HTML 外壳: `assets/template-swiss.html`

预览页保留文本编辑、页面属性控制、图片/视频 slot、组件原生元素动画、切换动画和导出功能。页面舞台固定 16:9 等比缩放,窗口多出的区域用黑色填充。

## 快速开始

```bash
npm install
npm run render:themes
npm run validate:swiss -- output/theme-preview/ppt/index.html
```

刷新全部已登记布局总览:

```bash
npm run showcase:update
```

渲染主题切换调试页:

```bash
npm run render:themes
```

按 JSON 计划渲染:

```bash
npm run render:goal -- examples/goal-decks/annual-review.json output/goal-demo/ppt/index.html
```

## 版本检查

安装版 Skill 每次完成用户请求后会运行:

```bash
node scripts/check_latest_version.mjs
```

脚本会对比本地版本和 GitHub 最新版本。有新版本时输出更新提醒;无新版本或网络不可用时不输出。

## 示例 Deck

| 文件 | 内容主题 | 说明 |
|---|---|---|
| `examples/component-decks/all-themes-showcase.jsx` | 主题调试总览 | 展示全部已验收主题页面 |
| `examples/goal-decks/annual-review.json` | AI 融资年度复盘 | 由 `render:goal` 根据 layout + props 组合 |
| `examples/goal-decks/portfolio.json` | AI 产品作品集 | 验证另一种内容组合 |

## 验证方式

```bash
npm test
npm run showcase:update
npm run validate:goal-copy -- output/my-deck/goal.json output/my-deck/ppt/index.html
```

<!-- project-docs:start -->
## 项目文档

以下文档由 `npm run docs:update` 同步。

- [ADR](docs/ADR.md): 当前架构决策记录
- [项目文件作用说明](docs/project-files.md): 当前 953 个源码文件的主要作用
<!-- project-docs:end -->
