# 🤖 Claude Code UI Helpers (3-in-1 Skills)

This repository features a suite of three expert-level skills for Claude Code, specifically designed to tackle three major pain points in frontend development: Component Management, Visual Consistency, and Style Risk Control. 

### Claude Code 智能 UI 助手 (3-in-1 Skills)

本仓库包含三套专为 Claude Code 打造的专家级技能，旨在解决前端开发中“组件管理”、“视觉规范”以及“样式风险控制”的三大痛点。



---

### 🚀 解决的问题场景 | Key Use Cases

* **场景 A：犹豫要不要新建组件？**
    * 使用 `Component-Guide`。它智能判断该“复用”、“修改”还是“新建”，拒绝重复造轮子。
    * *Decision-making: Reuse, Refactor, or Create? Let `Component-Guide` decide.*
* **场景 B：UI 还原度总是被提 Bug？**
    * 使用 `Design-Linter`。自动检测硬编码数值，强制执行设计系统规范。
    * *Audit: Catch hardcoded values and enforce design tokens automatically.*
* **场景 C：想改样式又怕改坏了？**
    * 使用 `Style-Guardian` 。**先分析影响、再给出方案、等待确认**。它为你提供“逻辑刹车”，确保复杂页面的样式调整安全可控。
    * *Safe Edit: Impact analysis & "Confirmation Lock" before any CSS changes.*



### 📦 包含的技能 | Included Skills

1.  **Style-Guardian (样式守护者) - NEW!** 🛡️
    * **核心功能**：非破坏性修改。它会先读取 `tokens.css`，生成“变更风险评估表”，在你回复“执行”前绝不动代码。
    * **Feature**: Non-destructive edits with a "Confirmation Lock." Pre-scans design tokens and presents a risk assessment table.
2.  **Component-Guide (智能组件管理)** 🧩
    * **核心功能**：分析需求 -> 搜索现有组件 -> 给出创建策略。
    * **Feature**: Smart component discovery and strategic creation guidance.
3.  **Design-Linter (设计规范走查)** 📏
    * **核心功能**：走查间距、字体、颜色变量，确保符合 Tailwind v4 规范。
    * **Feature**: Automated visual spec audit for Tailwind v4 & Design Systems.



### 🛠️ 快速安装 | Quick Installation (Mac/Linux)

Copy and paste the following command into your terminal:

```bash
git clone https://github.com/CallMeMing/claude-skills-ming.git && cp -r claude-skills-ming/style-guardian claude-skills-ming/design-linter claude-skills-ming/component-guide ~/.claude/skills/
```



### 💡 使用示例 | Usage Examples

```bash
# 安全地修改 A 页面的边距
/style-guardian "将 A 页面的顶部间距调大一点，注意不要挤压到导航栏"

# 智能分析组件创建策略
/component-guide "我需要一个带搜索功能的下拉多选框"

# 走查当前组件的视觉规范
/design-linter --file src/components/Button.tsx
```


### 📄 许可证 | License
MIT License
