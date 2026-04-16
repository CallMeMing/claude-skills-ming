
# 🤖 Claude Code 智能 UI 助手 (2-in-1 Skills)

本仓库包含两套专为 **Claude Code** 打造的专家级技能，旨在解决前端开发中“组件选型难”和“视觉还原不标准”的两大痛点。

### 🚀 解决的问题场景

* **场景 A：犹豫要不要新建组件？**
    * 使用 `Component-Guide` 助手。它会自动扫描现有代码库，智能判断该“复用旧组件”、“修改现有组件”还是“创建新组件”，拒绝重复造轮子。
* **场景 B：UI 还原度总是被 UI 提 Bug？**
    * 使用 `Design-Linter` 走查器。自动检测代码中的间距、字体、颜色是否符合设计规范（如：禁止硬编码颜色、强制使用语义化字体类）。

---

### 📦 包含的技能 (Skills)

1.  **Component-Guide (智能组件管理)**
    * **核心功能**：需求分析 -> 相似组件搜索 -> 决策建议。
    * **技术栈**：适配 React + TS, Radix UI, Tailwind v4。
2.  **Design-Linter (设计规范走查)**
    * **核心功能**：自动发现 `mt-[2px]` 等非标间距，强制 Icon 着色协议，校验颜色变量。
    * **支持格式**：Markdown 报告、JSON、CI/CD 集成。

---

### 🛠️ 快速安装

1.  **克隆/下载仓库**：
    `git clone https://github.com/你的用户名/你的仓库名.git`
2.  **部署到 Claude**：
    将本仓库中的两个文件夹（包含 `SKILL.md` 的文件夹）移动到你的本地技能目录：
    * **Mac/Linux**: `~/.claude/skills/`
    * **Windows**: `C:\Users\用户名\.claude\skills\`
3.  **激活**：
    在 Claude Code 终端输入 `/reload`。

### 快速安装命令 (Mac/Linux):
    
    git clone https://github.com/CallMeMing/claude-skills-ming.git && cp -r claude-skills-ming/* ~/.claude/skills/

---

### 💡 使用示例

```bash
# 智能分析组件创建策略
/component-guide "我需要一个带搜索功能的下拉多选框"

# 走查当前组件的视觉规范
/design-linter --file src/components/Button.tsx
```

---

### 📄 许可证
MIT License - 欢迎自由使用及贡献。
