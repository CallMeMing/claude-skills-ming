# style-guardian 样式守护者

## English Users

This skill supports both Chinese and English. You can interact with it in English directly. No configuration needed.

### What This Skill Does

style-guardian is a non-destructive style adjustment assistant that:

- Scans your design specifications (tokens.css, globals.css) before making changes
- Detects hardcoded values (px, rounded-[N], colors) that deviate from your design system
- Evaluates the impact of proposed changes on adjacent components
- Presents changes in a clear table format with risk assessments
- **Waits for your confirmation** before executing any code modifications

### How to Use

Simply describe what you need in natural language. For example:

- "Fix the border radius"
- "Adjust the spacing in the dropdown"
- "The checkbox alignment looks off"
- "Change the search box border color"

The skill will scan, analyze, and present a change plan. Reply "execute" to apply, or "cancel" to discard.

### Key Principle

**Non-destructive**: style-guardian will never auto-modify your code. It always presents a plan first and waits for your explicit confirmation.

---

## 背景

在前端开发中，样式调整看似简单，却常常"牵一发而动全身"。修改一个组件的 padding，可能会挤压旁边元素的布局；调整圆角大小，可能影响整体视觉一致性。传统的做法是改完后凭肉眼检查，容易遗漏潜在问题。

style-guardian 正是为解决这一痛点而生。它是一个非破坏性的样式调整助手，遵循"先分析、再评估、后执行"的三阶段确认锁机制，确保每次样式调整都是经过深思熟虑的、安全的。

## 核心价值

### 1. 规范先行，避免硬编码
style-guardian 在修改前会先读取设计规范文档（tokens.css、globals.css），自动识别代码中的硬编码数值，并推荐对应的语义化 Token，确保样式调整始终符合设计系统。

### 2. 影响评估，未改先知
在执行修改前，style-guardian 会评估修改对周边组件的影响，以表格形式呈现：
- 当前值 vs 建议值
- 风险等级（低/中/高）
- 对相邻组件的影响说明
- 暗色模式是否需要同步调整

### 3. 确认锁机制，安全可控
**强制确认机制**：分析完成后不会自动修改代码，而是输出变更摘要并等待用户明确回复"执行"。只有在获得确认后，才会应用代码更改。

### 4. 暗色模式同步检查
当修改涉及颜色、背景、边框等视觉属性时，style-guardian 会自动检查是否已在 globals.css 的 `.dark` 块中定义对应语义变量，避免出现亮暗模式不一致的问题。

## 使用场景

- **样式调整**：当你需要对组件的间距、圆角、颜色进行调整时
- **设计系统迁移**：将硬编码值替换为语义化 Token
- **布局修复**：修复因间距导致的布局错位问题
- **规范检查**：在提交前确认样式是否符合设计规范

## 技术特色

- **Tailwind CSS v4 原生支持**：直接使用 CSS 变量定义的 Token（te-* 系列）
- **design-linter 集成**：调用设计规范检测引擎
- **三阶段确认锁**：感知 → 评估 → 确认，确保每次修改都经过深思熟虑
- **目录限制**：仅扫描 `src/components/ui/` 目录，避免误改其他文件

style-guardian 不仅是一个工具，更是样式调整的最佳实践指南。它帮助开发者在修改前充分了解影响，在确认后安全地应用变更，让每次样式调整都变得可控、可靠。
