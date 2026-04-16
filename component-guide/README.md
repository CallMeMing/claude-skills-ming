# Component-Guide 智能组件管理助手


This skill supports both Chinese and English. You can interact with it in English directly. No configuration needed.

### What This Skill Does
Component-Guide is an intelligent component management assistant that helps you decide whether to create new components or reuse existing ones. It:
- Automatically checks your codebase for similar components
- Enforces design system consistency (spacing, typography, colors, etc.)
- Guides you through component creation decisions with clear options

### How to Use
Simply describe what you need in natural language. For example:
- "I need a button with an icon"
- "Create a user profile card component"
- "Use a modal dialog"

The skill will analyze your request, check existing components, and help you make the best decision.


## 背景

在现代前端开发中，组件复用是提高开发效率、保证代码一致性的关键。然而，随着项目规模扩大，开发者常常面临一个困境：是应该创建新组件，还是复用现有组件？过度创建会导致组件库臃肿，过度复用又可能让组件承担过多职责。

Component-Guide 正是为解决这一痛点而生。它是一个智能组件管理助手，能够根据用户指令自动分析需求，智能判断组件创建策略，确保组件库的健康发展和高效使用。

## 核心价值

### 1. 智能决策，避免重复造轮子
Component-Guide 会自动检查代码库中是否存在功能相似的组件。当用户需要某个功能时，它会：
- 完全匹配 → 直接复用现有组件
- 部分匹配 → 询问是否修改现有组件
- 无匹配 → 建议创建新组件

这种智能决策机制能有效避免重复开发，减少技术债务。

### 2. 设计系统一致性保障
技能内置严格的设计系统规范检查，确保所有组件：
- 遵循统一的间距约束（纵向≥8px，横向≥4px）
- 使用语义化的字体类（如 `text-te-md` 而非 `text-sm`）
- 遵守 Icon 着色协议（显式指定颜色变量）
- 采用标准化的 Padding 分级（sm/md/lg）

### 3. 开发效率大幅提升
通过自动化组件发现和决策流程，开发者可以：
- 快速找到可复用组件，减少搜索时间
- 避免不必要的组件创建，降低维护成本
- 确保新组件从一开始就符合设计规范

### 4. 团队协作标准化
Component-Guide 为团队提供了统一的组件创建标准，确保：
- 所有开发者遵循相同的决策逻辑
- 组件命名和结构保持一致
- 设计系统规范得到严格执行

## 使用场景

- **新功能开发**：快速判断是否需要创建新组件
- **代码重构**：识别可提取的通用组件
- **设计系统迁移**：确保新组件符合最新规范
- **团队协作**：统一组件创建标准，减少沟通成本

## 技术特色

- **Tailwind v4 原生支持**：直接使用 CSS 变量，无需额外配置
- **React + TypeScript 最佳实践**：类型安全，开发友好
- **Radix UI 集成**：基于成熟的底层组件库
- **响应式设计优先**：移动端优先，适配多端

Component-Guide 不仅是一个工具，更是前端开发的最佳实践指南。它帮助开发者在"创建"与"复用"之间找到最佳平衡点，让组件库始终保持健康、高效、一致的状态。
