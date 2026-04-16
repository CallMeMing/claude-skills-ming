---
name: design-linter
description: 设计规范走查器，自动检测生成的代码是否违反设计系统规范。启动时模糊搜索项目内的设计系统文档（支持多种命名），让用户选择规范来源；未找到时引导用户选择 CSS 变量文件或使用内置规则兜底。
---

# 设计规范走查器技能

## 技能概述
自动检测生成的代码是否违反design-system.md中的规范，确保代码符合设计系统要求。提供详细的违规报告和修复建议。

## 核心功能
1. **规范解析** - 解析design-system.md中的设计规范
2. **代码分析** - 分析生成的代码是否符合规范
3. **违规检测** - 检测违反规范的代码模式
4. **修复建议** - 提供具体的修复建议和正确示例
5. **报告生成** - 生成详细的规范检查报告

## 设计系统规范摘要

### 技术栈要求
- **框架**: React + TypeScript
- **样式**: Tailwind CSS v4 (CSS-first 配置)
- **组件库**: Radix UI + shadcn/ui
- **设计系统**: 基于 CSS 变量的自定义设计令牌系统 (tokens.css + globals.css)

### 强制规范约束

#### 1. 间距约束
- **纵向文字间距**: ≥ 8px (对应 `gap-spacing-te-sm` 或 `mt-spacing-te-sm`)
- **横向元素间距**: ≥ 4px (对应 `gap-spacing-te-xs`)
- **禁止**: 生成如 `mt-[2px]`、`gap-[3px]` 的非标代码
- **正确**: 使用 spacing-te token：`spacing-te-xs`(4px)、`spacing-te-sm`(8px)、`spacing-te-l`(12px)、`spacing-te-md`(16px)、`spacing-te-lg`(24px)

#### 2. 字体语义类
- **禁止**: 在组件内使用 `text-[xxpx]`、`text-xs`、`text-sm`、`text-lg` 等非语义类
- **必须**: 统一调用预设的语义类：`text-te-xs`(10px)、`text-te-sm`(11px)、`text-te-base`(13px)、`text-te-md`(14px 默认)、`text-te-lg`(16px)、`text-te-xl`(20px)、`text-te-2xl`(24px)
- **目标**: 确保排版节奏一致性和可维护性

#### 3. Icon着色协议
- **要求**: 当 Icon 与文字同行出现时，必须显式为 Icon 指定语义颜色变量
- **禁止**: 使用浏览器默认黑色或硬编码颜色值
- **正确**: 使用 `text-current` 继承父级颜色，或显式指定 `text-primary`、`text-muted-foreground` 等
- **注意**: 使用 `size-4` 而非 `w-4 h-4` 语法

#### 4. 内容区Padding分级
- **三级规范**:
  - `spacing-te-l`: 12px (紧凑间距)
  - `spacing-te-md`: 16px (默认，标准间距)
  - `spacing-te-lg`: 24px (大间距)
- **禁止**: 随意指定数值如 `p-[14px]` 或 `px-[18px]`
- **正确**: 使用 `p-spacing-te-l`、`p-spacing-te-md`、`p-spacing-te-lg`，或组合如 `px-spacing-te-lg`

#### 5. 颜色系统
- **必须**: 使用设计系统 CSS 变量：`--primary`、`--secondary`、`--accent`、`--muted`、`--destructive` 等，或 Tailwind 语义类 `text-primary`、`bg-secondary` 等
- **禁止**: 硬编码颜色值如 `#1E76F0`、`rgb(30, 118, 240)`
- **正确**: `text-primary`、`bg-primary`、`text-muted-foreground`、`border-border` 等
- **状态色**: `text-status-success`、`bg-status-warning`、`text-status-info` 等

#### 6. 响应式设计
- **要求**: 移动端优先的响应式类
- **示例**: `md:`, `lg:`, `xl:` 断点前缀

#### 7. 可访问性
- **要求**: 添加ARIA属性、键盘导航支持
- **WCAG**: 满足AA标准

#### 8. 暗色模式
- **要求**: 使用CSS变量支持主题切换
- **正确**: 使用设计系统变量而非硬编码颜色

#### 9. 阴影系统
- **正确**: 使用 `shadow-te-sm`、`shadow-te-md`、`shadow-te-lg`

#### 10. 圆角系统
- **正确**: 使用语义化圆角 `rounded-te-sm`(8px)、`rounded-te-base`(12px)、`rounded-te-md`(16px)、`rounded-te-lg`(20px)、`rounded-te-xl`(24px)

#### 11. Z-Index层级
- **正确**: 使用 `z-base`(0)、`z-raised`(10)、`z-dropdown`(20)、`z-overlay`(100)、`z-toast`(9999)

#### 12. 边框宽度
- **正确**: 使用 `border-te-thin`(1px)、`border-te-thick`(2px)

#### 13. 透明度
- **正确**: 使用 `opacity-te-subtle`(0.1)、`opacity-te-muted`(0.5)、`opacity-te-hover`(0.8)

#### 14. 动画系统
- **正确**: 使用 `animate-te-fade`（淡入动画）、`duration-te-fast`(150ms)、`duration-te-normal`(300ms)

## 检测规则

### 规则1: 间距约束检测
```regex
# 检测非标间距（任意 px 单位值）
/(mt|mb|ml|mr|pt|pb|pl|pr|gap|space-[xy])-\[[0-9]+px\]/g
# 检测过小间距（0-1 单位值）
/(mt|mb)-[01]|(gap|space-[xy])-0/g
```
**正确修复**: 使用 spacing-te-* token：`spacing-te-xs`(4px)、`spacing-te-sm`(8px)、`spacing-te-l`(12px)、`spacing-te-md`(16px)、`spacing-te-lg`(24px)

### 规则2: 字体类检测
```regex
# 检测直接字号类（方括号语法）
/text-\[[0-9]+px\]|leading-\[[0-9\.]+\]/g
# 检测非语义字体类（Tailwind 内置 text-* scale）
/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)(?!-te-)/g
```
**正确修复**: 使用 `text-te-*` 系列：`text-te-xs`(10px)、`text-te-sm`(11px)、`text-te-base`(13px)、`text-te-md`(14px)、`text-te-lg`(16px)、`text-te-xl`(20px)、`text-te-2xl`(24px)

### 规则3: Icon颜色检测
```regex
# 检测未指定颜色的Icon组件
/<[A-Z][a-zA-Z]*Icon\s+[^/>]*?(?:\/|(?:class="[^"]*")?\s*>)/g
# 检测硬编码颜色（black/white/gray-*/red-*/blue-*/green-* 等）
/class="[^"]*?\b(text-(?:black|white|gray-[0-9]+|red-[0-9]+|blue-[0-9]+|green-[0-9]+|yellow-[0-9]+|indigo-[0-9]+|violet-[0-9]+|pink-[0-9]+|purple-[0-9]+|cyan-[0-9]+|te-[a-z]+-[a-z]+))\b[^"]*"/g
```
**正确修复**: 使用 `text-current` 继承父级颜色，或显式指定 `text-primary`、`text-muted-foreground` 等语义颜色。使用 `size-*` 而非 `w-* h-*` 语法。

### 规则4: Padding分级检测
```regex
# 检测非标Padding（任意 px 单位值）
/(p|px|py|pt|pb|pl|pr)-\[[0-9]+px\]/g
# 检测非分级 Padding（已知的非标准值）
/(p|px|py)-\[[0-9]+px\](?!\s*\(|\s*spacing-te)/g
```
**正确修复**: 使用 `p-spacing-te-l`(12px)、`p-spacing-te-md`(16px)、`p-spacing-te-lg`(24px) 或组合如 `px-spacing-te-lg`、`py-spacing-te-md`

### 规则5: 颜色变量检测
```regex
# 检测硬编码颜色（hex/rgb/rgba/hsl/hsla）
/(#[0-9a-fA-F]{3,6}|rgb\(|rgba\(|hsl\(|hsla\()(?!\s*var\s*\()/g
# 检测非设计系统 CSS 变量（排除已知的合理变量）
/var\(--(?!color-|spacing-|shadow-|border-|opacity-|radius-|z-|font-|animate-|duration-)/g
```
**注意**: `var(--color-*)` 等是合法变量引用，需要进一步判断是否在白名单内
**正确修复**: 使用设计系统语义变量：`text-primary`、`bg-secondary`、`text-muted-foreground`、`border-border` 等，或直接使用 `--primary`、`--secondary` 等 CSS 变量

## 使用流程

### 步骤1: 代码输入
用户提供需要检查的代码片段或文件路径

### 步骤2: 定位设计系统文件

按以下顺序执行，直到确定规范来源：

#### 2a. 模糊搜索设计系统文档
在项目目录中搜索文件名包含以下任意关键词的 `.md` / `.json` / `.css` 文件：
- `design-system`、`design_system`、`designsystem`
- `design-token`、`design_token`、`token`
- `style-guide`、`styleguide`
- `ui-spec`、`ui_spec`、`规范`、`设计规范`

若找到 **1个以上**候选文件，**必须向用户展示候选列表并询问选择**，例如：

> 找到以下可能的设计规范文件，请选择：
> 1. `docs/design-system.md`
> 2. `src/styles/style-guide.md`
> 3. `tokens/design-token.json`
> 4. 以上都不是（跳至步骤 2b）

若只找到 **1个**，直接使用，无需询问。

#### 2b. 未找到设计系统文档时
若步骤 2a 未找到任何候选，询问用户：

> 未找到设计系统规范文件。是否以项目内的 CSS 变量文件 + skill 内置规则作为检查基准？

若用户同意，执行步骤 2c。

#### 2c. 定位 CSS 变量文件（带选择机制）
搜索项目中文件名包含以下关键词的 `.css` / `.scss` / `.less` 文件：
- `variables`、`vars`、`tokens`、`theme`
- `colors`、`palette`

若找到 **多个**候选，展示列表让用户选择，例如：

> 找到以下可能的 CSS 变量文件，请选择：
> 1. `variables.css`
> 2. `src/styles/variables_dark.css`
> 3. `src/styles/theme.css`
> 4. 跳过，仅使用 skill 内置规则

若只找到 **1个**，直接使用。
若 **未找到**，告知用户将仅依赖 skill 内置规则进行检查。

### 步骤3: 规范解析
1. 读取步骤2确认的规范来源
2. 解析强制约束规则
3. 建立检测模式

### 步骤4: 代码分析
1. 解析代码结构
2. 提取样式类
3. 识别组件模式

### 步骤5: 违规检测
1. 应用检测规则
2. 标记违规位置
3. 记录违规类型

### 步骤6: 报告生成
1. 生成详细报告（在报告头部注明本次使用的规范来源）
2. 提供修复建议
3. 显示正确示例

## 报告格式

### 违规报告模板
```
设计规范走查报告
================

文件: [文件名]
检查时间: [时间]
总问题数: [数量]

[问题1]
位置: 第X行
类型: [间距约束/字体类/Icon颜色/Padding分级/颜色系统]
违规代码: [违规代码片段]
问题描述: [详细描述]
修复建议: [具体修复建议]
正确示例: [正确代码示例]

[问题2]
...
```

### 严重程度分级
- **严重**: 违反核心规范，必须修复
- **警告**: 违反推荐规范，建议修复
- **提示**: 可优化项，非强制要求

## 使用示例

### 示例1: 检测间距违规
```tsx
// 输入代码
<div className="mt-[2px] gap-[3px]">
  <span>文本1</span>
  <span>文本2</span>
</div>

// 检测结果
[问题1]
位置: 第1行
类型: 间距约束
违规代码: mt-[2px]
问题描述: 纵向间距小于8px最小值
修复建议: 使用 spacing-te-sm (8px)
正确示例: <div className="mt-spacing-te-sm gap-spacing-te-xs">

[问题2]
位置: 第1行
类型: 间距约束
违规代码: gap-[3px]
问题描述: 横向间距小于4px最小值
修复建议: 使用 spacing-te-xs (4px)
正确示例: <div className="mt-spacing-te-sm gap-spacing-te-xs">
```

### 示例2: 检测字体类违规
```tsx
// 输入代码
<p className="text-[14px] leading-[1.5]">内容文本</p>

// 检测结果
[问题1]
位置: 第1行
类型: 字体类
违规代码: text-[14px]
问题描述: 使用直接字号类，违反字体语义类规范
修复建议: 使用 text-te-md (14px) 或其他 text-te-* 语义类
正确示例: <p className="text-te-md">内容文本</p>

[问题2]
位置: 第1行
类型: 字体类
违规代码: leading-[1.5]
问题描述: 使用直接行高类，违反字体语义类规范
修复建议: 如需控制行高，使用 leading-* 类（避免在 text-te-* 上叠加 font-size）
正确示例: <p className="text-te-md">内容文本</p>
```

### 示例3: 检测Icon颜色违规
```tsx
// 输入代码
<button>
  <Icon className="w-4 h-4" />
  <span>按钮</span>
</button>

// 检测结果
[问题1]
位置: 第2行
类型: Icon颜色
违规代码: <Icon className="w-4 h-4" />
问题描述: Icon未指定颜色，将使用浏览器默认黑色
修复建议: 添加 text-current 或语义颜色类，并使用 size-4 语法
正确示例: <Icon className="size-4 text-current" />
```

## 集成方式

### 作为技能调用
```bash
# 检查代码片段
/design-linter "代码片段"

# 检查文件
/design-linter --file src/components/Example.tsx

# 检查当前目录
/design-linter --dir src/components/
```

### 作为开发工具
1. **预提交检查**: 在git commit前自动运行
2. **代码审查**: 在PR中自动添加规范检查
3. **开发时检查**: 实时检测代码规范

## 配置选项

### 检查级别
- `--strict`: 严格模式，所有违规都视为错误
- `--warn`: 警告模式，只显示警告不阻止提交
- `--fix`: 自动修复模式，尝试自动修复问题

### 检查范围
- `--spacing`: 只检查间距约束
- `--typography`: 只检查字体类
- `--colors`: 只检查颜色系统
- `--all`: 检查所有规范（默认）

### 输出格式
- `--json`: JSON格式输出
- `--markdown`: Markdown格式输出
- `--html`: HTML格式输出
- `--simple`: 简单文本输出

## 最佳实践

### 开发流程集成
1. **本地开发**: 使用IDE插件实时检查
2. **代码提交**: 使用git hook预提交检查
3. **CI/CD**: 在流水线中自动运行检查
4. **代码审查**: 在PR中显示规范检查结果

### 团队协作
1. **规范文档**: 保持design-system.md更新
2. **培训指导**: 新成员规范培训
3. **代码模板**: 提供符合规范的代码模板
4. **定期审计**: 定期进行代码规范审计

## 错误处理

### 常见错误
1. **规范文件缺失**: 触发步骤 2b → 2c 的引导流程，不直接报错
2. **代码解析失败**: 提供错误位置和修复建议
3. **规则冲突**: 报告规则冲突并提供解决方案
4. **修复失败**: 提供手动修复指导

### 容错机制
1. **部分检查**: 当部分规则失败时继续其他检查
2. **渐进修复**: 提供分步修复建议
3. **学习模式**: 记录常见错误模式，优化检测规则

## 更新维护

### 规则更新
1. **规范变更**: 当design-system.md更新时同步更新规则
2. **错误反馈**: 根据用户反馈优化检测规则
3. **技术演进**: 适应新技术栈和工具变化

### 性能优化
1. **缓存机制**: 缓存解析结果提高性能
2. **增量检查**: 只检查变更部分
3. **并行处理**: 多文件并行检查