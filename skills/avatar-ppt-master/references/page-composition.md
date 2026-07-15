# 单页内容构图规则

主题负责统一视觉语言；构图负责把材料转换为可判断的信息关系。一页只承担一个主要认知任务，确保 5 秒读出结论、30 秒看懂依据。

## 选择顺序

1. 定义页面任务：判断、比较、诊断、解释、建模、排序或行动。
2. 识别信息关系：并列、因果、过程、时间、层级、空间、构成或趋势。
3. 先写结论式标题，不使用只有主题词的标题。
4. 根据关系选择视觉结构，并设置唯一视觉主角。
5. 为数据、模型和比较页补充 `insight`，说明「这意味着什么」。

不要先决定「做成几张卡片」。卡片是结果，不是默认翻译方式。

## 页面任务映射

| 页面任务 | 推荐结构 | 查询角色 |
| --- | --- | --- |
| 全局判断 | 单页主张、执行摘要 | `statement` / `overview` |
| 证据 | Hero 指标、趋势、数据页 | `evidence` |
| 取舍 | 双栏对比、决策矩阵 | `comparison` / `decision` |
| 问题根因 | 三层诊断模型 | `diagnosis` |
| 机制说明 | 流程与步骤 | `explanation` |
| 要素关系 | 分层架构、协作模型 | `model` |
| 阶段推进 | Roadmap、里程碑 | `timeline` |
| 下一步 | 优先级、责任与时间 | `actions` |

## 关系到视觉结构

| 信息关系 | 优先结构 | 不应使用 |
| --- | --- | --- |
| 相互独立、同层级要点 | 卡片、并列清单 | 强行连线 |
| 原因到结果 | 因果链、诊断模型 | 独立卡片 |
| 先后动作 | 流程、时间线、Roadmap | 环形图、漏斗图 |
| 上下层依赖 | 分层架构、树状关系 | 平铺卡片 |
| 同一整体的构成 | 环形图、堆叠条形图 | 折线图 |
| 连续时间或有序阶段 | 折线图、面积图 | 类别卡片 |
| 方案取舍 | 对比、矩阵、象限 | 无共同尺度的 KPI 拼盘 |
| 一个关键数字 | Hero 指标、前后对比 | 多张同权重卡片 |

## 卡片使用边界

- 仅在信息互相独立、层级一致、读者需要快速扫读时使用卡片。
- 因果、过程、时间、层级或连续数据必须保留关系，不拆成卡片。
- 正文中卡片主导页原则上不超过三分之一。
- 连续卡片主导页不超过 2 页；超过时改用主张、模型、图表、矩阵、时间线或媒体叙事。
- 同一页不要把所有元素都加边框和底色；保留一个主角，其余内容降级为标注、轴线或辅助说明。

## 全篇视觉节奏

规划完成后按页面顺序标记视觉家族：`statement`、`card-grid`、`model`、`chart`、`comparison`、`timeline`、`narrative/media`。

- 任何连续 5 页至少使用 3 个视觉家族。
- 章节页使用固定章节语法，可以受控重复。
- 版式复用优先于错误图表；同一 layout 最多使用 2 次且不得相邻。
- 页面变化来自信息关系和视觉焦点，不来自随机换色或增加装饰。

## 生成前的构图计划

在输出目录创建 `composition-plan.json`，但不要写入 `goal.json`。普通文字型 deck 使用 `standard`；风险型 deck 使用 `evidence` 并按 `references/evidence-and-storyline.md` 补充证据关联、限制和组件清单：

```json
{"mode":"evidence","pages":[{"page":3,"pageJob":"decision","relationship":"priority","messageTitle":"先完成三项基础决策，再扩大建设范围","visualTranslation":"priority actions with owner and timing","visualFamily":"comparison","primaryFocus":"三项决策","insightStrip":"先验证规则，再扩大投入","imagePolicy":"CSS/SVG only","scrRole":"resolution","evidenceIds":["E05","E06"],"caveat":"成本口径仍需财务复核","soWhat":"先验证规则，再扩大投入","densityTarget":"balanced","componentInventory":["title","priority matrix","owner labels","source note","insight strip"]}]}
```

## 检查清单

- 标题是否直接表达判断。
- 是否只有一个主要论点和一个视觉主角。
- 内容是否已从段落翻译成合适的视觉结构。
- 数据、模型、比较页是否解释了结论。
- 是否存在堆砌文本、无关默认文案或空媒体槽。
- 卡片是否真的表示并列信息，而不是把关系拆散。
- 任意连续 5 页是否至少包含 3 个视觉家族。
- 页面任务、标题承诺和最终可见内容是否一致。
- 风险型页面是否能通过 `evidenceIds` 回到证据底表。
- `componentInventory` 中的来源、图例、限制和结论是否都已落到页面。
