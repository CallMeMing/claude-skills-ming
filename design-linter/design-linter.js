#!/usr/bin/env node

/**
 * 设计规范走查器 - CLI工具
 * 自动检测代码是否违反design-system.md中的规范
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 设计系统规范
const DESIGN_SYSTEM = {
  // 间距约束
  spacing: {
    minVertical: 8, // px
    minHorizontal: 4, // px
    forbiddenPatterns: [
      /(mt|mb|ml|mr|pt|pb|pl|pr|gap|space-[xy])-\[[0-9]+px\]/g,
      /(mt|mb)-[01]/g,
      /(gap|space-[xy])-0/g
    ],
    allowedPadding: ['p-3', 'p-4', 'p-5', 'px-3', 'px-4', 'px-5', 'py-3', 'py-4', 'py-5']
  },

  // 字体语义类
  typography: {
    forbiddenPatterns: [
      /text-\[[0-9]+px\]/g,
      /leading-\[[0-9\.]+\]/g,
      /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g
    ],
    semanticClasses: [
      'typo-body',
      'typo-body-medium',
      'typo-caption',
      'typo-caption-medium',
      'typo-heading-sm',
      'typo-heading-md',
      'typo-heading-lg',
      'typo-page-title',
      'typo-section-title'
    ]
  },

  // Icon着色协议
  iconColors: {
    requiredForIcons: true,
    forbiddenColors: ['text-black', 'text-white', /text-(gray|red|blue|green)-[0-9]+/],
    recommendedColors: ['text-current', 'text-primary', 'text-secondary', 'text-muted-foreground']
  },

  // 颜色系统
  colors: {
    forbiddenPatterns: [
      /#[0-9a-fA-F]{3,6}/g,
      /rgb\(/g,
      /rgba\(/g,
      /hsl\(/g,
      /hsla\(/g
    ],
    requiredPrefix: 'var(--tant-'
  },

  // 组件结构
  components: {
    requiredImports: ['React'],
    preferredImports: ['cn from "./utils"']
  }
};

// 检测结果
class DetectionResult {
  constructor(filePath) {
    this.filePath = filePath;
    this.violations = [];
    this.warnings = [];
    this.suggestions = [];
  }

  addViolation(type, line, code, description, fix) {
    this.violations.push({
      type,
      line,
      code: code.trim(),
      description,
      fix,
      severity: 'error'
    });
  }

  addWarning(type, line, code, description, fix) {
    this.warnings.push({
      type,
      line,
      code: code.trim(),
      description,
      fix,
      severity: 'warning'
    });
  }

  addSuggestion(type, line, code, description, fix) {
    this.suggestions.push({
      type,
      line,
      code: code.trim(),
      description,
      fix,
      severity: 'suggestion'
    });
  }

  hasIssues() {
    return this.violations.length > 0 || this.warnings.length > 0;
  }

  toJSON() {
    return {
      file: this.filePath,
      violations: this.violations,
      warnings: this.warnings,
      suggestions: this.suggestions,
      summary: {
        totalViolations: this.violations.length,
        totalWarnings: this.warnings.length,
        totalSuggestions: this.suggestions.length
      }
    };
  }

  toMarkdown() {
    let output = `# 设计规范走查报告\n\n`;
    output += `文件: ${this.filePath}\n`;
    output += `检查时间: ${new Date().toLocaleString()}\n`;
    output += `总问题数: ${this.violations.length + this.warnings.length}\n\n`;

    if (this.violations.length > 0) {
      output += `## ❌ 规范违规 (${this.violations.length}个)\n\n`;
      this.violations.forEach((violation, index) => {
        output += `### 问题 ${index + 1}\n`;
        output += `- **位置**: 第${violation.line}行\n`;
        output += `- **类型**: ${violation.type}\n`;
        output += `- **违规代码**: \`${violation.code}\`\n`;
        output += `- **问题描述**: ${violation.description}\n`;
        output += `- **修复建议**: ${violation.fix}\n\n`;
      });
    }

    if (this.warnings.length > 0) {
      output += `## ⚠️ 规范警告 (${this.warnings.length}个)\n\n`;
      this.warnings.forEach((warning, index) => {
        output += `### 警告 ${index + 1}\n`;
        output += `- **位置**: 第${warning.line}行\n`;
        output += `- **类型**: ${warning.type}\n`;
        output += `- **代码**: \`${warning.code}\`\n`;
        output += `- **描述**: ${warning.description}\n`;
        output += `- **建议**: ${warning.fix}\n\n`;
      });
    }

    if (this.suggestions.length > 0) {
      output += `## 💡 优化建议 (${this.suggestions.length}个)\n\n`;
      this.suggestions.forEach((suggestion, index) => {
        output += `### 建议 ${index + 1}\n`;
        output += `- **位置**: 第${suggestion.line}行\n`;
        output += `- **类型**: ${suggestion.type}\n`;
        output += `- **代码**: \`${suggestion.code}\`\n`;
        output += `- **描述**: ${suggestion.description}\n`;
        output += `- **优化**: ${suggestion.fix}\n\n`;
      });
    }

    if (!this.hasIssues()) {
      output += `## ✅ 通过检查\n\n`;
      output += `代码符合所有设计规范要求。\n`;
    }

    return output;
  }
}

// 代码分析器
class CodeAnalyzer {
  constructor(designSystem = DESIGN_SYSTEM) {
    this.designSystem = designSystem;
  }

  analyzeFile(filePath) {
    const result = new DetectionResult(filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        this.analyzeLine(line, index + 1, result);
      });

      // 整体分析
      this.analyzeOverall(content, result);

    } catch (error) {
      console.error(`读取文件失败: ${filePath}`, error);
    }

    return result;
  }

  analyzeLine(line, lineNumber, result) {
    // 检查间距约束
    this.checkSpacing(line, lineNumber, result);

    // 检查字体类
    this.checkTypography(line, lineNumber, result);

    // 检查Icon颜色
    this.checkIconColors(line, lineNumber, result);

    // 检查颜色系统
    this.checkColors(line, lineNumber, result);

    // 检查Padding分级
    this.checkPadding(line, lineNumber, result);
  }

  analyzeOverall(content, result) {
    // 检查React导入
    if (content.includes('export function') || content.includes('export const')) {
      if (!content.includes('import React') && !content.includes('import * as React')) {
        result.addWarning(
          '组件结构',
          1,
          '缺少React导入',
          'React组件应该导入React',
          '添加 import * as React from "react";'
        );
      }
    }

    // 检查cn导入
    if (content.includes('className={cn(') && !content.includes('import { cn }')) {
      result.addSuggestion(
        '组件结构',
        1,
        '使用cn函数但未导入',
        'cn函数用于合并className，建议导入',
        '添加 import { cn } from "./utils";'
      );
    }
  }

  checkSpacing(line, lineNumber, result) {
    const { spacing } = this.designSystem;

    // 检查非标间距
    spacing.forbiddenPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          result.addViolation(
            '间距约束',
            lineNumber,
            match,
            '使用非标准间距值，违反间距约束规范',
            '使用标准间距类如 mt-2, gap-1, space-y-2 等'
          );
        });
      }
    });

    // 检查Padding分级
    const paddingMatch = line.match(/(p|px|py|pt|pb|pl|pr)-\[[0-9]+px\]/g);
    if (paddingMatch) {
      paddingMatch.forEach(match => {
        result.addViolation(
          'Padding分级',
          lineNumber,
          match,
          '使用非标准Padding值，违反Padding分级规范',
          `使用标准Padding类: ${spacing.allowedPadding.join(', ')}`
        );
      });
    }
  }

  checkTypography(line, lineNumber, result) {
    const { typography } = this.designSystem;

    typography.forbiddenPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          result.addViolation(
            '字体类',
            lineNumber,
            match,
            '使用直接字号类，违反字体语义类规范',
            `使用语义类: ${typography.semanticClasses.join(', ')}`
          );
        });
      }
    });

    // 检查是否使用语义类
    const hasTypographyClass = typography.semanticClasses.some(cls => line.includes(cls));
    const hasTextClass = line.includes('text-') && !line.includes('text-current');

    if (hasTextClass && !hasTypographyClass && line.includes('className="')) {
      result.addSuggestion(
        '字体类',
        lineNumber,
        line.match(/className="[^"]*"/)[0],
        '考虑使用语义字体类提高一致性',
        `尝试使用 ${typography.semanticClasses.join(' 或 ')}`
      );
    }
  }

  checkIconColors(line, lineNumber, result) {
    const { iconColors } = this.designSystem;

    // 检测Icon组件
    const iconRegex = /<([A-Z][a-zA-Z]*Icon|Icon)\s+[^>]*>/g;
    const iconMatches = line.match(iconRegex);

    if (iconMatches) {
      iconMatches.forEach(iconTag => {
        // 检查是否有className
        if (!iconTag.includes('className="')) {
          result.addViolation(
            'Icon颜色',
            lineNumber,
            iconTag,
            'Icon未指定样式类，包括颜色',
            '添加 className 属性，如 className="w-4 h-4 text-current"'
          );
          return;
        }

        // 提取className
        const classMatch = iconTag.match(/className="([^"]*)"/);
        if (classMatch) {
          const className = classMatch[1];

          // 检查是否有颜色类
          const hasColorClass = iconColors.recommendedColors.some(color =>
            className.includes(color)
          ) || className.includes('text-[');

          if (!hasColorClass) {
            result.addViolation(
              'Icon颜色',
              lineNumber,
              iconTag,
              'Icon未指定颜色，将使用浏览器默认黑色',
              `添加颜色类如 ${iconColors.recommendedColors.join(' 或 ')}`
            );
          }

          // 检查是否使用禁止的颜色
          iconColors.forbiddenColors.forEach(forbidden => {
            if (typeof forbidden === 'string') {
              if (className.includes(forbidden)) {
                result.addViolation(
                  'Icon颜色',
                  lineNumber,
                  iconTag,
                  `使用禁止的颜色类: ${forbidden}`,
                  `使用设计系统颜色类如 ${iconColors.recommendedColors.join(' 或 ')}`
                );
              }
            } else if (forbidden.test(className)) {
              result.addViolation(
                'Icon颜色',
                lineNumber,
                iconTag,
                '使用硬编码颜色类',
                '使用设计系统颜色变量'
              );
            }
          });
        }
      });
    }
  }

  checkColors(line, lineNumber, result) {
    const { colors } = this.designSystem;

    // 检查硬编码颜色
    colors.forbiddenPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          result.addViolation(
            '颜色系统',
            lineNumber,
            match,
            '使用硬编码颜色值，违反颜色系统规范',
            '使用设计系统变量如 var(--tant-primary-color-primary-default)'
          );
        });
      }
    });

    // 检查是否使用设计系统变量
    if (line.includes('text-[') || line.includes('bg-[') || line.includes('border-[')) {
      const colorValueMatch = line.match(/(text|bg|border)-\[([^\]]+)\]/);
      if (colorValueMatch) {
        const value = colorValueMatch[2];
        if (!value.includes('var(--tant-')) {
          result.addViolation(
            '颜色系统',
            lineNumber,
            colorValueMatch[0],
            '使用硬编码颜色值在方括号中',
            '使用设计系统变量如 var(--tant-primary-color-primary-default)'
          );
        }
      }
    }
  }

  checkPadding(line, lineNumber, result) {
    // 已经在checkSpacing中处理
  }
}

// CLI主程序
class DesignLinterCLI {
  constructor() {
    this.analyzer = new CodeAnalyzer();
    this.options = {
      format: 'markdown',
      strict: false,
      fix: false,
      output: null
    };
  }

  parseArgs(args) {
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg === '--format' || arg === '-f') {
        this.options.format = args[++i];
      } else if (arg === '--output' || arg === '-o') {
        this.options.output = args[++i];
      } else if (arg === '--strict' || arg === '-s') {
        this.options.strict = true;
      } else if (arg === '--fix' || arg === '-x') {
        this.options.fix = true;
      } else if (arg === '--help' || arg === '-h') {
        this.showHelp();
        process.exit(0);
      } else if (arg === '--version' || arg === '-v') {
        console.log('设计规范走查器 v1.0.0');
        process.exit(0);
      } else if (!arg.startsWith('-')) {
        this.options.file = arg;
      }
    }
  }

  showHelp() {
    console.log(`
设计规范走查器 - 自动检测代码设计规范

用法:
  design-linter [选项] <文件或目录>

选项:
  -f, --format <格式>    输出格式: markdown, json, simple (默认: markdown)
  -o, --output <文件>    输出到文件
  -s, --strict           严格模式，所有警告视为错误
  -x, --fix              尝试自动修复
  -h, --help             显示帮助信息
  -v, --version          显示版本信息

示例:
  design-linter src/components/Button.tsx
  design-linter --format json src/components/
  design-linter --output report.md src/
    `);
  }

  run() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
      this.showHelp();
      process.exit(1);
    }

    this.parseArgs(args);

    if (!this.options.file) {
      console.error('错误: 请指定要检查的文件或目录');
      this.showHelp();
      process.exit(1);
    }

    const filePath = path.resolve(this.options.file);

    if (!fs.existsSync(filePath)) {
      console.error(`错误: 文件或目录不存在: ${filePath}`);
      process.exit(1);
    }

    const stats = fs.statSync(filePath);
    let results = [];

    if (stats.isDirectory()) {
      results = this.analyzeDirectory(filePath);
    } else {
      results = [this.analyzer.analyzeFile(filePath)];
    }

    this.outputResults(results);

    // 检查是否有严重错误
    const hasErrors = results.some(result => result.violations.length > 0);
    if (hasErrors && this.options.strict) {
      console.error('\n❌ 发现规范违规，严格模式失败');
      process.exit(1);
    }
  }

  analyzeDirectory(dirPath) {
    const results = [];
    const files = this.getTypeScriptFiles(dirPath);

    console.log(`检查目录: ${dirPath}`);
    console.log(`找到 ${files.length} 个TypeScript文件\n`);

    files.forEach((file, index) => {
      process.stdout.write(`检查中... ${index + 1}/${files.length}\r`);
      const result = this.analyzer.analyzeFile(file);
      if (result.hasIssues()) {
        results.push(result);
      }
    });

    console.log('\n检查完成');
    return results;
  }

  getTypeScriptFiles(dirPath) {
    const files = [];

    function traverse(currentPath) {
      const items = fs.readdirSync(currentPath);

      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 跳过node_modules等目录
          if (!item.startsWith('.') && item !== 'node_modules') {
            traverse(fullPath);
          }
        } else if (stat.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts'))) {
          files.push(fullPath);
        }
      });
    }

    traverse(dirPath);
    return files;
  }

  outputResults(results) {
    let output = '';

    if (this.options.format === 'json') {
      output = JSON.stringify(results.map(r => r.toJSON()), null, 2);
    } else {
      // Markdown格式
      output = '# 设计规范走查报告\n\n';
      output += `检查时间: ${new Date().toLocaleString()}\n`;
      output += `检查文件数: ${results.length}\n\n`;

      let totalViolations = 0;
      let totalWarnings = 0;
      let totalSuggestions = 0;

      results.forEach(result => {
        totalViolations += result.violations.length;
        totalWarnings += result.warnings.length;
        totalSuggestions += result.suggestions.length;

        if (result.hasIssues()) {
          output += result.toMarkdown().replace('# 设计规范走查报告\n\n', '');
          output += '---\n\n';
        }
      });

      output += `## 统计摘要\n\n`;
      output += `- ❌ 规范违规: ${totalViolations}个\n`;
      output += `- ⚠️ 规范警告: ${totalWarnings}个\n`;
      output += `- 💡 优化建议: ${totalSuggestions}个\n`;

      if (totalViolations === 0 && totalWarnings === 0) {
        output += `\n🎉 所有文件都符合设计规范！\n`;
      }
    }

    if (this.options.output) {
      fs.writeFileSync(this.options.output, output);
      console.log(`报告已保存到: ${this.options.output}`);
    } else {
      console.log(output);
    }
  }
}

// 运行CLI
if (require.main === module) {
  const cli = new DesignLinterCLI();
  cli.run();
}

module.exports = {
  DesignLinterCLI,
  CodeAnalyzer,
  DetectionResult,
  DESIGN_SYSTEM
};