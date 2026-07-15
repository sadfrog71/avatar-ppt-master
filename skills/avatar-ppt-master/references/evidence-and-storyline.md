# 证据、故事线与内容锁定

本文件用于公式、派生数字、图表、15 页以上长 deck，以及来源冲突或需要审计的正式汇报。目标是让每个关键结论可追溯，并防止布局适配时静默改写事实。

## 两种模式

- `standard`：普通文字型 deck。创建 `composition-plan.json`，不强制证据底表和内容锁定。
- `evidence`：风险型 deck。必须创建 `evidence-ledger.json`、增强版 `composition-plan.json` 和 `content-lock.json`。

不要为了套框架强制整篇使用 SCR。复杂决策或高风险汇报可把页面标为 `situation`、`complication`、`resolution`；封面、目录、过渡页使用 `none`。

## 证据底表

先抽取事实，再写页面。每个证据项至少记录主张、数值与单位、时间或场景、来源、可信度、限制、含义和推荐视觉。保留原始口径；换算时同时记录 `normalized`，不能覆盖原始值。

```json
{
  "version": "1.0",
  "items": [{
    "id": "E01",
    "claim": "试点处理时长下降",
    "value": 18,
    "unit": "%",
    "period": "2026 Q2 试点",
    "source": {"type": "file", "label": "试点测算表", "location": "summary!B12"},
    "confidence": "medium",
    "caveat": "样本量有限",
    "implication": "可进入扩大验证阶段",
    "recommendedVisual": "before-after bar",
    "raw": {"value": 0.18, "unit": "ratio"},
    "normalized": {"value": 18, "unit": "%", "method": "ratio × 100"}
  }]
}
```

运行：

```bash
npm --prefix <skill-root>/project run validate:evidence -- output/<deck>/evidence-ledger.json
```

同一主张出现冲突数值时，不静默择一；在 `caveat` 记录冲突和采用口径。没有真实数据的结构示意使用 `source.type: "illustrative"`，不要伪装成经营结果。

## 增强版构图计划

风险型 deck 在常规构图字段之外增加：

- `scrRole`：当前页在问题叙事中的角色。
- `evidenceIds`：本页引用的证据 ID。
- `caveat`：读者必须知道的限制。
- `soWhat`：本页对判断或行动的意义。
- `densityTarget`：`sparse`、`balanced` 或 `dense`。
- `componentInventory`：预计出现的标题、图表、标注、来源和结论条等组件。

`densityTarget` 约束内容量，不是要求塞满页面。`componentInventory` 用于避免渲染后缺失来源、结论或必要图例。

## 内容锁定

完成 `goal.json`、构图计划和证据底表后生成锁文件：

```bash
npm --prefix <skill-root>/project run content:lock -- \
  --goal output/<deck>/goal.json \
  --plan output/<deck>/composition-plan.json \
  --evidence output/<deck>/evidence-ledger.json \
  --out output/<deck>/content-lock.json
```

锁文件使用规范化 JSON 的 SHA-256。之后任何事实、标题、页面任务或证据变化都会在渲染前失败。合理修改内容后，重新复核并显式重建锁文件；不要自动刷新锁来掩盖漂移。

## 双门禁

PPTX 交付同时满足：

1. `editableInformationLayer`：文字与关键信息对象可编辑，没有越界、占位符或纯图片信息层。
2. `visualSemanticsPreserved`：渲染检查确认层级、图表含义和模板底板未被破坏。

结构解析不能证明视觉语义正确。导出后先生成 QA 报告，再在看过渲染结果后把视觉门禁标为 `passed`：

```bash
npm --prefix <skill-root>/project run validate:pptx-structure -- \
  output/<deck>/<deck>.pptx --visual-review passed --strict
```
