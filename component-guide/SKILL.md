---
name: component-guide
description: 智能组件管理助手，根据用户指令自动判断是否创建新组件、复用现有组件，或在需要时询问用户创建决策。基于设计系统规范，确保组件一致性和合规性。
---

# 组件使用手册技能

## 技能概述
智能组件管理助手，根据用户指令自动判断是否创建新组件、复用现有组件，或在需要时询问用户创建决策。

## 核心功能
1. **组件智能识别** - 分析用户需求，识别所需组件类型
2. **现有组件检查** - 检查代码库中是否有可复用的组件
3. **创建决策逻辑** - 根据用户指令决定是否创建新组件
4. **组件规范生成** - 按照设计系统规范创建组件

## 设计系统上下文
基于以下设计系统规范：

### 技术栈
- React + TypeScript + Tailwind CSS v4 + Radix UI
- **Tailwind v4 无配置特性**：本项目采用 Tailwind v4，所有自定义 Token 均通过 CSS 变量在 globals.css 中定义。生成组件时，直接使用 `bg-primary`、`text-te-md` 或 `z-toast` 等变量别名，**严禁生成任何需配置在 tailwind.config.js 中的类名**。
- 设计系统：基于 CSS 变量的自定义设计令牌系统
- 组件库：使用 Radix UI 作为基础组件，配合自定义样式

### 品牌个性
- 专业、可信赖、现代、创新、简洁、高效、友好、易用

### 视觉规范
- 色彩系统：遵循主色调（亮色模式蓝色/暗色模式紫罗兰色）和辅助色（灰色）
- 字体：PingFang SC字体，支持中英文显示
- 布局：响应式设计，移动端优先
- 主题：支持亮色/暗色模式

## 决策流程

### 1. 需求分析阶段
```
用户指令 → 提取关键词 → 识别组件类型 → 检查现有组件
```

### 2. 组件匹配逻辑
- **完全匹配**: 组件名称/功能与需求完全一致 → 直接复用
- **部分匹配**: 功能相似但需要调整 → 询问是否修改现有组件
- **无匹配**: 全新功能需求 → 进入创建决策流程

### 3. 创建决策规则
```
IF 用户明确说"创建新组件" THEN
  创建新组件
ELSE IF 用户说"使用组件"或"添加组件" THEN
  检查现有组件 → 存在则复用，不存在则创建
ELSE IF 用户描述功能但未指定组件 THEN
  检查现有组件 → 存在则复用，不存在则询问用户
ELSE
  默认复用现有组件或询问用户
```

### 4. 询问模板
当需要用户决策时，使用以下模板：
```
检测到您需要 [组件功能描述] 功能。

现有组件检查：
- ✅ [现有组件1] - 功能相似度: 80%
- ❌ [现有组件2] - 功能不匹配

选项：
1. 复用现有组件 [组件名称] 并进行调整
2. 创建新的专用组件 [建议组件名称]
3. 使用组合组件方案 [组件A + 组件B]

您希望选择哪种方案？
```

## 组件创建规范

### 文件命名规范
- 使用PascalCase: `ComponentName.tsx`
- 描述性名称: `UserProfileCard.tsx` 而非 `Card.tsx`
- 类型明确: 添加类型后缀如 `Button.tsx`, `Modal.tsx`

### 组件结构模板
```tsx
import * as React from "react";
import { cn } from "./utils"; // 或从适当路径导入

// 类型定义
interface ComponentNameProps extends React.ComponentProps<"div"> {
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  padding?: "sm" | "md" | "lg"; // 新增：内容区Padding分级
  // 其他自定义props
}

// 样式变量定义（使用cva）
const componentNameVariants = cva(
  "base-styles", // 基础样式
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-background",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
      padding: {
        sm: "p-spacing-te-l",      // spacing-te-l: 12px
        md: "p-spacing-te-md",     // spacing-te-md: 16px (默认)
        lg: "p-spacing-te-lg",     // spacing-te-lg: 24px
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      padding: "md",    // 默认使用中等间距
    },
  }
);

export function ComponentName({
  className,
  variant,
  size,
  padding,
  ...props
}: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(componentNameVariants({ variant, size, padding, className }))}
      {...props}
    />
  );
}
```

### 设计系统集成要点
1. **颜色使用**: 使用设计系统变量 `--primary`, `--secondary`, `--accent`
2. **间距系统**: 严格遵守间距约束：
   - 纵向文字间距 ≥ 8px (对应 `gap-spacing-te-sm` 或 `mt-spacing-te-sm`)
   - 横向元素间距 ≥ 4px (对应 `gap-spacing-te-xs`)
   - **禁止**生成如 `mt-[2px]`、`gap-[3px]` 的非标代码
   - 统一使用 spacing-te token：`spacing-te-xs`(4px)、`spacing-te-sm`(8px)、`spacing-te-l`(12px)、`spacing-te-md`(16px)、`spacing-te-lg`(24px)
3. **字体排版**: 强制使用语义类：
   - **严禁**在描述生成时使用 `text-sm` 或 `text-[14px]`，必须使用语义化的 `text-te-sm` 或 `text-te-md`
   - 这能确保生成的页面在字号层级上与全局设计系统完美对齐
   - 必须统一调用预设的语义类：`text-te-sm`、`text-te-base`、`text-te-md`、`text-te-lg`、`text-te-xl`、`text-te-2xl` 等
   - 确保排版节奏一致性和可维护性
4. **Icon着色协议**:
   - 当 Icon 与文字同行出现时，必须显式为 Icon 指定语义颜色变量
   - **禁止**使用浏览器默认黑色或硬编码颜色值
   - 使用 `text-current` 继承父级颜色，或显式指定 `text-primary`、`text-muted-foreground` 等
5. **内容区Padding分级**:
   - 容器内部间距必须从以下分级中选择：
     - `spacing-te-l`: 12px (紧凑间距)
     - `spacing-te-md`: 16px (默认，标准间距)
     - `spacing-te-lg`: 24px (大间距)
   - **禁止**随意指定数值如 `p-[14px]` 或 `px-[18px]`
   - 可组合使用：`p-spacing-te-md` (16px)、`px-spacing-te-lg` (24px横向) 等
6. **响应式**: 添加移动端优先的响应式类
7. **可访问性**: 添加ARIA属性、键盘导航支持
8. **暗色模式**: 使用CSS变量支持主题切换
9. **阴影系统**: 使用 `shadow-te-sm`、`shadow-te-md`、`shadow-te-lg`
10. **圆角系统**: 使用语义化圆角 `rounded-te-sm`(8px)、`rounded-te-base`(12px)、`rounded-te-md`(16px)、`rounded-te-lg`(20px)、`rounded-te-xl`(24px)
11. **动画系统**: 使用 `animate-te-fade`（淡入动画）、`duration-te-fast`(150ms)、`duration-te-normal`(300ms)
12. **Z-Index层级**: 使用 `z-base`(0)、`z-raised`(10)、`z-dropdown`(20)、`z-overlay`(100)、`z-toast`(9999)
13. **边框宽度**: 使用 `border-te-thin`(1px)、`border-te-thick`(2px)
14. **透明度**: 使用 `opacity-te-subtle`(0.1)、`opacity-te-muted`(0.5)、`opacity-te-hover`(0.8)
15. **状态色**: 使用 `bg-status-success`/`text-status-success`、`bg-status-warning`/`text-status-warning`、`bg-status-info`/`text-status-info` 等

## 常见组件类型识别

### 基础UI组件
- 按钮、输入框、选择器、开关、滑块
- 卡片、模态框、抽屉、弹出框
- 导航、标签页、面包屑、分页

### 业务组件
- 数据展示: 表格、列表、图表
- 表单组件: 表单、验证、提交
- 交互组件: 拖拽、排序、筛选
- 状态组件: 加载、空状态、错误

### 页面骨架规范

**宏观布局约束**：
1. **页面主体容器**：必须包含 `h-100dvh` 和 `overflow-hidden`（参考 globals.css 布局约束）
2. **滚动处理**：在需要滚动的容器上必须使用自定义的滚动条样式（即 `scrollbar-width: thin` 相关类）
3. **响应式设计**：移动端优先，使用 Tailwind 响应式断点

**页面结构示例**：
```tsx
// 页面骨架模板
export default function PageName() {
  return (
    <div className="h-100dvh overflow-hidden">
      {/* 页眉 */}
      <header className="h-16 border-b border-border">
        {/* 导航内容 */}
      </header>

      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto">
        {/* 页面内容 - 滚动条样式已在 globals.css 全局定义 */}
        <div className="container mx-auto p-spacing-te-md">
          {/* 具体内容 */}
        </div>
      </main>

      {/* 页脚 */}
      <footer className="h-12 border-t border-border">
        {/* 页脚内容 */}
      </footer>
    </div>
  );
}
```

## 使用示例

### 示例1: 用户需要"一个带图标的按钮"
```
分析: 按钮组件 → 检查现有组件
结果: button.tsx 存在 → 询问是否复用
询问: "检测到已有按钮组件，是否需要添加图标支持？"
```

### 示例2: 用户需要"用户个人资料卡片"
```
分析: 卡片组件 → 检查现有组件
结果: card.tsx 存在但功能不完整 → 询问创建决策
询问: "现有卡片组件缺少个人资料特定功能，是否创建 UserProfileCard 组件？"
```

### 示例4: 用户需要"带图标和文字的按钮"
```
分析: 按钮组件 + Icon + 文字 → 检查现有组件
结果: button.tsx 存在 → 验证规范
验证点:
1. Icon是否显式指定颜色？必须使用 text-current 或语义颜色
2. 文字是否使用语义类？必须使用 typo-body 等
3. 间距是否符合约束？纵向≥8px，横向≥4px
4. Padding是否使用分级？必须从 sm/md/lg 中选择

正确实现示例:
<Button className="gap-spacing-te-sm p-spacing-te-md">
  <Icon className="text-current size-4" />
  <span className="text-te-md">按钮文字</span>
</Button>
```

### 示例5: 用户需要"内容卡片组件"
```
分析: 卡片组件 → 检查现有组件
结果: card.tsx 存在 → 验证规范
验证点:
1. 内容区Padding是否使用分级？必须使用 pad-content-* 类
2. 内部元素间距是否符合约束？
3. 文字是否使用语义类？

正确实现示例:
<Card className="p-spacing-te-md">  <!-- spacing-te-md: 16px -->
  <div className="gap-spacing-te-sm">  <!-- 纵向间距≥8px -->
    <h3 className="text-te-lg font-medium">标题</h3>
    <p className="text-te-md text-muted-foreground">描述内容</p>
    <div className="flex gap-spacing-te-sm">  <!-- 横向间距≥4px -->
      <Icon className="text-primary size-4" />
      <span className="text-te-sm">标签</span>
    </div>
  </div>
</Card>
```

## 实施步骤

### 步骤1: 分析用户需求
- 提取关键词和功能描述
- 识别组件类型和复杂度
- 检查现有组件库

### 步骤2: 组件匹配检查
- 使用Glob工具搜索相关组件
- 评估功能匹配度
- 确定复用可能性

### 步骤3: 决策和执行
- 根据决策规则选择方案
- 创建或修改组件
- **强制规范检查**:
  1. 间距约束：纵向≥8px（gap-spacing-te-sm），横向≥4px（gap-spacing-te-xs）
  2. 字体语义类：**严禁**使用 `text-sm` 或 `text-[14px]`，必须使用语义化的 `text-te-*` 系列
  3. Icon着色：显式指定颜色变量
  4. Padding分级：从 spacing-te-l(12px)/spacing-te-md(16px)/spacing-te-lg(24px) 中选择
- 确保设计系统合规性

### 步骤4: 验证和反馈
- 检查组件功能完整性
- **验证设计系统一致性**:
  1. 间距约束合规性检查（使用 spacing-te-* token）
  2. 字体语义类使用验证：**严禁**使用 `text-sm` 或 `text-[14px]`，必须使用语义化的 `text-te-*` 系列
  3. Icon着色协议执行情况
  4. Padding分级规范遵循（使用 spacing-te-* token）
- 提供使用说明和规范提醒

## 最佳实践

1. **优先复用**: 尽量复用现有组件，保持一致性
2. **渐进增强**: 先使用基础组件，再添加高级功能
3. **文档注释**: 为新组件添加使用示例和文档
4. **类型安全**: 使用TypeScript确保类型安全
5. **测试友好**: 组件设计考虑可测试性

## 错误处理

1. **组件不存在**: 提供创建建议
2. **命名冲突**: 建议新名称
3. **导入错误**: 检查路径和导出
4. **类型错误**: 验证props类型定义
5. **规范违规**: 检测并纠正以下问题：
   - 间距约束违规：如使用 `mt-[2px]`、`gap-[3px]`
   - 字体类违规：**严禁**使用 `text-sm` 或 `text-[14px]`，必须使用语义化的 `text-te-sm` 或 `text-te-md`
   - Icon着色违规：如未指定颜色或使用硬编码颜色
   - Padding分级违规：如使用 `p-[14px]`、`px-[18px]`
6. **设计系统不一致**: 检查颜色、间距、字体等是否遵循设计系统

## 与现有技能集成

### 与 frontend-design 集成
- 当需要创建新界面时，先使用component-guide检查组件
- 确保新组件符合设计系统规范

### 与 tailwind-design-system 集成
- 使用 Tailwind v4 的 CSS-first 配置
- **本项目采用 Tailwind v4，所有自定义 Token 均通过 CSS 变量在 globals.css 中定义。生成组件时，直接使用 `bg-primary`、`text-te-md` 或 `z-toast` 等变量别名，严禁生成任何需配置在 config 文件中的类名。**
- 遵循设计令牌和主题系统

### 与 impeccable:extract 集成
- 从现有代码中提取可重用组件
- 标准化组件接口和样式