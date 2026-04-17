---
name: style-guardian
description: A non-destructive style adjustment assistant that reviews design specifications, evaluates impact, and executes changes only after confirmation. | 非破坏性样式调整助手。在修改前先走查设计规范，评估影响，确认后再执行。
---

---

## 🌐 Language Policy (i18n)

**Language Detection:** Detect the language of the user's input.

**Response Consistency:** Always respond in the same language as the user's input (e.g., if the user asks in English, output the report and suggestions in English; if in Chinese, use Chinese).

**Core Logic:** The internal rules and design specs (like spacing, colors) remain the same regardless of the language.

**For English Users:** When evaluating style changes, explain clearly:
- **What违规 pattern was detected:** Explain what hardcoded value was found and why it doesn't match the design system
- **What建议值 is recommended:** Show the semantic token or te-* class that should replace it
- **What风险:** Explain if the change might affect adjacent components

---

# style-guardian（样式守护者）

> 非破坏性样式调整助手。在修改前先走查设计规范，评估影响，确认后再执行。

## 技能概述

当你需要对组件样式进行调整时，style-guardian 会在修改前先扫描设计规范，评估影响范围，并等待你确认后再执行代码更改。它遵循"先分析、再评估、后执行"的三阶段确认锁机制，确保每次样式调整都是安全的、可控的。

## 核心功能

1. **规范走查** - 读取 tokens.css 和 globals.css，自动识别硬编码数值
2. **影响评估** - 分析修改对相邻组件的影响，以表格形式呈现
3. **确认执行** - 强制停顿等待用户确认，确认后才会修改代码
4. **暗色模式检查** - 自动检测颜色修改是否需要同步暗色模式

## 设计系统上下文

基于以下设计系统规范：

### 技术栈
- React + TypeScript + Tailwind CSS v4
- **Tailwind v4 无配置特性**：所有自定义 Token 均通过 CSS 变量在 globals.css 中定义
- 设计系统：基于 CSS 变量的自定义设计令牌系统


## 三阶段确认锁

### Phase 1：感知与分析（Scan & Analyze）

**目标**：定位问题 + 找出所有与规范不符的硬编码数值

**步骤**：
1. 读取规范文档：
   - `src/app/tokens.css` — 原始 Token 定义（色值、间距、圆角、阴影）
   - `src/app/globals.css` — @theme inline 块（Tailwind 工具类映射）
2. 扫描目标文件（限制范围：`src/components/ui/`）
3. 调用 `design-linter` skill 作为检测引擎
4. 根据检测到的**违规类型**自动匹配规范映射

**输出**：违规清单

---

### Phase 2：影响评估（Impact Report）

**目标**：告诉你修改 A 处是否会挤压到旁边的 B 组件

**分析方法**：
- 检查修改点的父容器和相邻元素
- 评估 margin/padding/gap 修改对周边布局的影响
- 仅提示"可能影响相邻组件"，不做精确的 AST 影响链分析

**输出表格**：

| 修改点 | 文件 | 当前值 | 建议值 | 风险等级 | 影响说明 | 暗色模式 |
|--------|------|--------|--------|----------|----------|----------|
| | | | | | | |

**风险等级判定**：
- 🟢 **低风险**：使用项目已定义 Token 替换硬编码值（语义一致性修复）
- 🟡 **中风险**：涉及 margin/padding/gap 可能影响周边元素
- 🔴 **高风险**：修改会改变组件尺寸或交互行为（如 width、height、position）

**暗色模式提示**：
- 如果修改涉及颜色、背景、边框等视觉属性，需检查是否已在 `globals.css` 的 `.dark` 块中定义对应语义变量
- 如仅有亮色模式覆盖，需标注"⚠️ 需确认暗色模式是否需要同步调整"

---

### Phase 3：确认锁（Confirmation Lock）

**强制停顿**，输出：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  方案已就绪。以下是变更摘要：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Impact Report 表格]

📁 修改文件清单：
•

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
方案已就绪。如果您确认，请回复"执行"，我将为您应用代码更改。
回复"取消"可放弃本次操作。
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**用户回复处理**：
- `"执行"` → 应用代码更改，输出成功摘要
- `"取消"` → 放弃本次操作，输出取消确认
- 其他输入 → 提示"请回复'执行'或'取消'"

---

## 使用示例

### 示例1: 用户说"修复圆角"
```
分析: 扫描 src/components/ui/ 目录
结果: 发现 checkbox.tsx 使用 rounded-[4px]
建议: 替换为 rounded-te-sm
影响: 可能影响 checkbox 与 label 的对齐关系
风险: 🟡 中
暗色模式: 无需调整（圆角不涉及颜色）
```

### 示例2: 用户说"调整间距"
```
分析: 扫描 multi-select-dropdown.tsx
结果: 发现 my-te-sm 可以改为 mb-1
建议: 使用更精确的 mb-1
影响: 仅影响下拉面板内部间距
风险: 🟢 低
暗色模式: 无需调整（间距不涉及颜色）
```

## 内部依赖

- `design-linter` skill — 检测引擎，扫描硬编码数值
- `src/app/tokens.css` — 原始 Token 定义
- `src/app/globals.css` — Tailwind v4 @theme inline 映射

## 关键设计决策

1. **非破坏性**：只提建议，不自动修改。用户确认前不会触碰代码。
2. **Token 优先**：优先使用项目已定义的 te-* 间距、rounded-te-* 圆角、语义化颜色 Token
3. **简化影响分析**：不进行精确的 AST 依赖分析，仅提示"可能影响相邻组件"
4. **无版本回滚**：不记录变更快照，依赖 Git 进行回滚
5. **目录限制**：仅扫描 `src/components/ui/` 目录下的文件

## 与现有技能集成

### 与 design-linter 集成
- 调用 design-linter 作为检测引擎
- 自动接收违规检测结果并生成 Impact Report

### 与 tailwind-design-system 集成
- 使用 Tailwind v4 的 CSS-first 配置
- 遵循设计令牌和主题系统
