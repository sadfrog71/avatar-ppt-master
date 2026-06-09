# {project_name} - Design Spec

> This document is the human-readable design narrative — rationale, audience, style, color choices, content outline. It is read once by downstream roles for context.
>
> The machine-readable execution contract lives in `spec_lock.md` (short form of color / typography / icon / image decisions). Executor re-reads `spec_lock.md` before every SVG page to resist context-compression drift. Keep the two files in sync; if they diverge, `spec_lock.md` wins.

## I. Project Information

| Item | Value |
| ---- | ----- |
| **Project Name** | 港华安全漏洞整改 |
| **Canvas Format** | PPT 16:9 (1280×720) |
| **Page Count** | 6 |
| **Design Style** | B) General Consulting（通用咨询风格） |
| **Target Audience** | 港华内部管理层 + 外部合作方 |
| **Use Case** | 技术沟通会议 / 漏洞整改汇报 |
| **Created Date** | 2026-04-24 |

---

## II. Canvas Specification

| Property | Value |
| -------- | ----- |
| **Format** | PPT 16:9 |
| **Dimensions** | 1280×720 |
| **viewBox** | `0 0 1280 720` |
| **Margins** | 左右 40px，上下 40px |
| **Content Area** | 1200×640 |

---

## III. Visual Theme

### Theme Style

- **Style**: General Consulting — 专业咨询，逻辑清晰，数据层次分明
- **Theme**: 浅色主题（白色背景）
- **Tone**: 技术严谨、正式商务

### Color Scheme（蓝白风格）

| Role | HEX | Purpose |
| ---- | --- | ------- |
| **Background** | `#FFFFFF` | 页面白色主背景 |
| **Secondary bg** | `#F0F5FF` | 淡蓝辅助区块 |
| **Primary** | `#1A56DB` | 标题、强调、图标、主蓝 |
| **Secondary** | `#3B82F6` | 次级强调 |
| **Accent** | `#0EA5E9` | 高亮强调 |
| **Body text** | `#111827` | 正文主文字 |
| **Secondary text** | `#6B7280` | 说明文字 |
| **Tertiary text** | `#9CA3AF` | 辅助信息 |
| **Border/divider** | `#E5E7EB` | 卡片边框、分隔线 |
| **Success / 策略** | `#16A34A` | 正向策略标签 |
| **Warning / 漏洞** | `#DC2626` | 漏洞警示标记 |

### Gradient Scheme

```xml
<!-- 标题渐变 -->
<linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="#1A56DB"/>
  <stop offset="100%" stop-color="#0EA5E9"/>
</linearGradient>

<!-- 顶部装饰条 -->
<rect fill="#1A56DB" width="1280" height="4"/>
```

---

## IV. Typography System

### Font Plan

**Recommended preset**: P1 — 现代商务字体

| Role | Chinese | English | Fallback |
| ---- | ------- | ------- | -------- |
| **Title** | Microsoft YaHei Bold | Arial Bold | sans-serif |
| **Body** | Microsoft YaHei Regular | Arial | sans-serif |
| **Code** | — | Consolas | Monaco |
| **Emphasis** | Microsoft YaHei SemiBold | Arial | sans-serif |

**Font stack**: `"Microsoft YaHei", Arial, sans-serif`

### Font Size Hierarchy

**Baseline**: Body font size = 18px（内容较密集）

| Purpose | Ratio | Size | Weight |
| ------- | ----- | ---- | ------ |
| Cover title | 3x | 54px | Bold |
| Chapter title | 2x | 36px | Bold |
| Content title | 1.5x | 27px | Bold |
| Subtitle | 1.2x | 22px | SemiBold |
| **Body content** | **1x** | **18px** | Regular |
| Annotation | 0.75x | 13px | Regular |
| Page number/date | 0.6x | 11px | Regular |

---

## V. Layout Principles

### Page Structure

- **Header area**: 顶部 80px（含标题栏蓝条 + 页面标题）
- **Content area**: 640px - 80px - 40px = 中间区域
- **Footer area**: 底部 40px（含页码）

### Common Layout Modes

| Mode | Used In |
| ---- | ------- |
| **Single column centered** | Slide 01 封面 |
| **Left-right split (4:6)** | Slide 02 问题概述 |
| **Card grid** | Slide 03-05 系统详情 |
| **Timeline + list** | Slide 06 治本方案 |

### Spacing Specification

| Element | Value |
| ------- | ----- |
| Card gap | 20px |
| Content block gap | 24px |
| Card padding | 20px |
| Card border radius | 8px |
| Icon-text gap | 12px |
| Card height | 80-100px each |

---

## VI. Icon Usage Specification

### Source

- **Built-in icon library**: `chunk`（直线几何风格）
- **Usage method**: 直接内联 SVG，不使用 placeholder

### Recommended Icon List

| Purpose | Icon Description | Page |
| ------- | ---------------- | ---- |
| 系统 | 矩形方块 / 屏幕图标 | Slide 02-05 |
| 漏洞 | 警告三角或圆形图标 | Slide 02-05 |
| 策略 | 箭头或盾牌图标 | Slide 03-05 |
| VPN | 网络连接图标 | Slide 06 |
| 时间 | 时钟或时间轴节点 | Slide 06 |

> 无需从图标库查找，Executor 将使用简洁 SVG 内联绘制。

---

## VII. Visualization Reference List

| Visualization Type | Reference Template | Used In |
| ------------------ | ------------------ | ------- |
| 四象限 / 矩阵卡片 | 自定义布局（card grid） | Slide 03-05 |
| 时间轴 | 自定义布局（timeline） | Slide 06 |

---

## VIII. Image Resource List

**无图片需求** — 纯内容型 PPT，使用蓝白配色 + 卡片布局。

---

## IX. Content Outline

### Part 1: 封面

#### Slide 01 — 封面

- **Layout**: 单栏居中 + 顶部蓝色装饰条
- **Title**: 安全漏洞整改说明
- **Subtitle**: 香港红队 2026 Red Team Finding
- **Info**: 面向港华内外部沟通 · 2026年4月

---

### Part 2: 问题概述

#### Slide 02 — 问题概述

- **Layout**: 左侧标题 + 右侧系统列表卡片
- **Title**: 安全漏洞概述
- **Visualization**: 无图表，纯卡片列表
- **Content**:
  - 背景说明：三个系统面向外网、无法限定IP、HTTPS加密、已第三方安全测试
  - 漏洞共性：管理员登录页 / 管理端口暴露于互联网
  - 系统1：rsp.towngas.com.cn — 端口 3389、5985、5986
  - 系统2：ecard.towngas.com.cn — 端口 3389
  - 系统3：houtai.towngas.com.cn — 路径 /cmsLogin

---

### Part 3: 系统一 — 共享资源管理平台

#### Slide 03 — 系统一详情

- **Layout**: 上下结构（漏洞卡片 + 策略卡片）
- **Title**: 系统一 · 共享资源管理平台
- **Subtitle**: rsp.towngas.com.cn
- **Content**:
  - **漏洞标记（红色）**：3389 / 5985 / 5986 管理端口暴露公网
  - **应对策略（绿色）**：
    - 临时：强密码 + 双因素认证（2FA）
    - 中期：云端安全组限制管理IP白名单
    - 长期：VPN内网访问，彻底切断公网暴露

---

### Part 4: 系统二 — 电子卡系统

#### Slide 04 — 系统二详情

- **Layout**: 上下结构（漏洞卡片 + 策略卡片）
- **Title**: 系统二 · 电子卡系统
- **Subtitle**: ecard.towngas.com.cn
- **Content**:
  - **漏洞标记（红色）**：3389 端口（RDP）暴露公网
  - **应对策略（绿色）**：
    - 临时：RDP强密码策略 + 账户锁定
    - 中期：安全组阻断3389公网入站
    - 长期：华为云VPN打通，纯内网访问

---

### Part 5: 系统三 — 后台管理系统

#### Slide 05 — 系统三详情

- **Layout**: 上下结构（漏洞卡片 + 策略卡片）
- **Title**: 系统三 · 后台管理系统
- **Subtitle**: houtai.towngas.com.cn
- **Content**:
  - **漏洞标记（红色）**：/cmsLogin 管理登录页暴露公网
  - **应对策略（绿色）**：
    - 临时：后台路径随机化 + 强认证
    - 中期：接入双因素认证（2FA）
    - 长期：VPN内网访问，移除公网登录入口

---

### Part 6: 治本方案

#### Slide 06 — 治本方案与整改计划

- **Layout**: 左侧根本原因 + 右侧时间轴整改路径
- **Title**: 治本方案与整改计划
- **Content**:
  - **根本原因**：管理端口与业务端口共用公网出口，缺乏分层防御
  - **核心方案**：华为云 ↔ 港华内网 VPN 打通
    - 关闭所有系统公网管理端口暴露
    - 保留公网业务访问，管理员走VPN
    - 结合MFA，构建零信任访问体系
  - **时间节点**：
    - 立即处置（1周内）
    - 短期加固（2-4周）
    - 中期建设（1-3月）
    - 长期运营（持续）

---

## X. Speaker Notes Requirements

- **File naming**: `notes/01_cover.md` ~ `notes/06_solution.md`
- **Style**: 正式商务语言
- **Duration**: 每页 1-2 分钟，全篇约 6-10 分钟
- **Format**: 要点式，附过渡语

---

## XI. Technical Constraints Reminder

### SVG Generation Rules:
1. viewBox: `0 0 1280 720`
2. 背景使用 `<rect>` 元素
3. 文字换行使用 `<tspan>`（`<foreignObject>` 禁止）
4. 透明度使用 `fill-opacity` / `stroke-opacity`；**禁止 rgba()**
5. 禁止：`<clipPath>`, `<mask>`, `<style>`, `class`, `foreignObject`
6. 禁止：`textPath`, `<animate*>`, `<script>`
7. 图标内联 SVG，不使用 `<symbol>`+`<use>`

### PPT 兼容性规则：
- 禁止 `<g opacity>`（组透明度）；需在每个子元素上单独设置
- 图片透明度使用叠加遮罩层
- 仅内联样式；禁止外部 CSS 和 `@font-face`
