# Design-linter 设计规范走查器使用指南

This skill supports both Chinese and English. You can interact with it in English directly. No configuration needed.

### What This Skill Does
Design-Linter automatically checks your generated code against design system specifications. It detects violations in:
- Spacing constraints (vertical ≥8px, horizontal ≥4px)
- Typography semantic classes (no text-[14px], must use text-te-*)
- Icon coloring protocol (must specify explicit colors)
- Padding grading (sm/md/lg levels)

### How to Use
Simply paste your code and ask for a design review. For example:
- "Check this component for design violations"
- "Review my button code"
- "Lint this file"

The skill will analyze your code and provide detailed violation reports with fix suggestions.

## 快速开始

### 作为Claude Code技能使用
```bash
# 检查代码片段
/design-linter "你的代码片段"

# 检查文件
/design-linter --file src/components/Example.tsx

# 检查目录
/design-linter --dir src/components/
```

### 作为命令行工具使用
```bash
# 安装（可选）
npm install -g ./design-linter

# 检查单个文件
design-linter src/components/Button.tsx

# 检查整个目录
design-linter src/

# 输出JSON格式
design-linter --format json src/components/

# 输出到文件
design-linter --output report.md src/
```

## 检测规则

### 1. 间距约束检测
- **违规**: `mt-[2px]`, `gap-[3px]`, `space-x-0`
- **正确**: `mt-2`, `gap-1`, `space-y-2`
- **最小值**: 纵向≥8px, 横向≥4px

### 2. 字体语义类检测
- **违规**: `text-[14px]`, `leading-[1.5]`, `text-sm`
- **正确**: `typo-body`, `typo-caption-medium`, `typo-heading-lg`
- **要求**: 使用预设语义类，禁止直接字号

### 3. Icon着色协议检测
- **违规**: `<Icon className="w-4 h-4" />` (无颜色)
- **违规**: `<Icon className="w-4 h-4 text-black" />` (硬编码颜色)
- **正确**: `<Icon className="w-4 h-4 text-current" />`
- **正确**: `<Icon className="w-4 h-4 text-primary" />`

### 4. Padding分级检测
- **违规**: `p-[14px]`, `px-[18px]`
- **正确**: `p-3` (12px), `p-4` (16px), `p-5` (20px)
- **三级规范**: sm(12px), md(16px), lg(20px)

### 5. 颜色系统检测
- **违规**: `#1E76F0`, `rgb(30, 118, 240)`
- **正确**: `var(--tant-primary-color-primary-default)`
- **要求**: 使用设计系统变量

## 集成到开发流程

### 1. Git预提交钩子
```bash
# .husky/pre-commit
#!/bin/sh
design-linter --strict src/components/
```

### 2. CI/CD流水线
```yaml
# .github/workflows/design-lint.yml
name: Design System Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Design Linter
        run: |
          npx design-linter --strict src/
```

### 3. VS Code任务
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Design Lint",
      "type": "shell",
      "command": "design-linter src/",
      "problemMatcher": []
    }
  ]
}
```

## 配置选项

### 输出格式
- `--format markdown`: Markdown格式报告（默认）
- `--format json`: JSON格式，便于程序处理
- `--format simple`: 简单文本输出

### 检查模式
- `--strict`: 严格模式，所有警告视为错误
- `--warn`: 警告模式（默认）
- `--fix`: 尝试自动修复（实验性）

### 检查范围
- `--spacing`: 只检查间距
- `--typography`: 只检查字体
- `--colors`: 只检查颜色
- `--all`: 检查所有（默认）

## 示例报告

### Markdown报告示例
```markdown
# 设计规范走查报告

文件: src/components/Button.tsx
检查时间: 2026-03-13 18:30:22
总问题数: 3

## ❌ 规范违规 (2个)

### 问题 1
- **位置**: 第15行
- **类型**: 间距约束
- **违规代码**: `mt-[2px]`
- **问题描述**: 使用非标准间距值，违反间距约束规范
- **修复建议**: 使用标准间距类如 mt-2, gap-1, space-y-2 等

### 问题 2
- **位置**: 第20行
- **类型**: Icon颜色
- **违规代码**: `<Icon className="w-4 h-4" />`
- **问题描述**: Icon未指定颜色，将使用浏览器默认黑色
- **修复建议**: 添加颜色类如 text-current 或 text-primary

## ⚠️ 规范警告 (1个)

### 警告 1
- **位置**: 第25行
- **类型**: 字体类
- **代码**: `text-[14px]`
- **描述**: 使用直接字号类，违反字体语义类规范
- **建议**: 使用语义类: typo-body, typo-caption-medium
```

### JSON报告示例
```json
{
  "file": "src/components/Button.tsx",
  "violations": [
    {
      "type": "间距约束",
      "line": 15,
      "code": "mt-[2px]",
      "description": "使用非标准间距值，违反间距约束规范",
      "fix": "使用标准间距类如 mt-2, gap-1, space-y-2 等",
      "severity": "error"
    }
  ],
  "summary": {
    "totalViolations": 1,
    "totalWarnings": 0,
    "totalSuggestions": 0
  }
}
```

## 最佳实践

### 1. 开发时检查
```bash
# 实时检查当前文件
design-linter --watch src/components/

# 只检查变更文件
git diff --name-only HEAD | grep '.tsx$' | xargs design-linter
```

### 2. 代码审查集成
```bash
# PR检查脚本
#!/bin/bash
echo "## 设计规范检查结果"
design-linter --format markdown src/components/
```

### 3. 团队规范
1. **新人培训**: 使用走查器学习规范
2. **代码模板**: 提供符合规范的模板
3. **定期审计**: 每月运行全面检查
4. **规范更新**: 同步更新走查器规则

## 故障排除

### 常见问题
1. **文件读取失败**: 检查文件路径和权限
2. **规则误报**: 报告问题以便优化规则
3. **性能问题**: 使用增量检查或缓存

### 调试模式
```bash
# 显示详细日志
DEBUG=design-linter design-linter src/

# 只检查特定规则
design-linter --spacing src/components/
```

## 扩展开发

### 添加自定义规则
```javascript
// custom-rules.js
module.exports = {
  rules: [
    {
      name: '组件命名规范',
      pattern: /export function ([A-Z][a-zA-Z]*)/g,
      check: (match) => {
        const componentName = match[1];
        return componentName.endsWith('Component')
          ? { valid: false, message: '组件名不应以Component结尾' }
          : { valid: true };
      }
    }
  ]
};
```

### 集成到其他工具
- **ESLint插件**: 作为ESLint规则
- **Prettier插件**: 自动格式化时检查
- **Webpack插件**: 构建时检查
- **编辑器插件**: 实时编辑器提示

## 更新维护

### 规则更新流程
1. 更新design-system.md规范
2. 同步更新DESIGN_SYSTEM常量
3. 更新检测规则模式
4. 测试验证
5. 发布更新

### 反馈收集
- 误报报告
- 漏报报告
- 性能问题
- 功能建议

## 许可证
MIT License - 自由使用和修改
