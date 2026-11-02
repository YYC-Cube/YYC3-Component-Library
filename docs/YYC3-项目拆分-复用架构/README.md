---
file: README.md
title: YYC³ 构建智能与复用架构 — 目录索引
description: YYC³ 知识库构建、复用清洗与工程化索引
author: YYC³ Team <admin@0379.email>
version: v1.0.0
created: 2026-11-02
updated: 2026-11-02
status: stable
tags: [index, kb, reuse, architecture]
category: general
language: zh-CN
audience: developers,managers
complexity: basic
---

# YYC³ 构建智能与复用架构 — 目录索引

> **_YYC³_**（YanYuCloudCube™ · 注册商标）
> _言启象限 | 语枢未来_
> **_Words Initiate Quadrants, Language Serves as Core for Future_**
> _万象归元于云枢 | 深栈智启新纪元_
> **_All things converge in cloud pivot; Deep stacks ignite a new era of intelligence_**

---

## 核心理念

**五高架构**：高可用 | 高性能 | 高安全 | 高扩展 | 高智能
**五标体系**：标准化 | 规范化 | 自动化 | 可视化 | 智能化
**五化转型**：流程化 | 数字化 | 生态化 | 工具化 | 服务化
**五维评估**：时间维 | 空间维 | 属性维 | 事件维 | 关联维

---

## 一、目录职责

本目录收录 YYC³ 知识库架构、向量操作、复用清洗与衔接、分析分类工具，以及 Next.js + React 多项目复用架构指南。

## 二、文档清单

| 序号 | 文档 | 说明 | 版本 | 分类 |
| ---- | ---- | -------- | ---- | ---- |
| 01 | [YYC³ KB 分析分类脚本](./YYC3-KB-分析分类脚本.md) | YYC³ KB 构建分析、分类与重复检测交互式 CLI 脚本 | v1.1.0 | technical |
| 02 | [YYC³ KB 向量操作手册](./YYC3-KB-向量操作手册.md) | YYC³ CloudCube KB 向量检索与全链路操作手册 | v1.1.0 | guide |
| 03 | [YYC³ KB 复用框架规划](./YYC3-KB-复用框架规划.md) | YYC³ 复用框架体系、模板分层与四阶段实施规划 | v1.1.0 | technical |
| 04 | [YYC³ KB 复用清洗指导](./YYC3-KB-复用清洗指导.md) | YYC³ 项目复用清洗、重复识别与模板归纳指导 | v1.1.0 | guide |
| 05 | [YYC³ KB 复用衔接指导](./YYC3-KB-复用衔接指导.md) | YYC³ UI/UX 复用体系与知识库衔接全链路指导 | v1.1.0 | guide |
| 06 | [YYC³ KB 架构操作指南](./YYC3-KB-架构操作指南.md) | YYC³ KB 知识库架构、表结构与操作指南 | v3.1.0 | guide |
| 07 | [YYC³ KB 清洗分析工具](./YYC3-KB-清洗分析工具.md) | YYC³ 项目清洗分析与报告生成工具使用说明 | v1.1.0 | technical |
| 08 | [YYC³ KB 清洗分类工具](./YYC3-KB-清洗分类工具.md) | YYC³ 项目聚类、模板提炼与分类工具指南 | v1.1.0 | technical |
| 09 | [YYC³ KB 清洗实施构建](./YYC3-KB-清洗实施构建.md) | YYC³ 清洗工作区、CLI 模板与一键生成实施构建 | v1.1.0 | technical |
| 10 | [YYC³ Next.js + React 多项目并行开发与复用架构](./YYC3-Next-React-多项目复用架构.md) | YYC³ Next.js + React 多项目复用、代码优化与工程化指南 | v1.1.0 | technical |

## 三、配套代码文件

| 文件 | 说明 | 语言 |
| ---- | -------- | ---- |
| [YYC3-interactive-analyzer.js](./YYC3-interactive-analyzer.js) | 项目分析、分类与重复检测交互式 CLI | JavaScript |

## 四、阅读建议

1. **体系规划**：先读 `YYC3-KB-复用框架规划.md` 与 `YYC3-KB-架构操作指南.md`。
2. **知识库操作**：参考 `YYC3-KB-向量操作手册.md` 完成向量检索与入库。
3. **清洗复用**：按 `YYC3-KB-复用清洗指导.md`、`YYC3-KB-复用衔接指导.md` 落地模板复用。
4. **工具支撑**：使用分析/分类脚本与 `YYC3-interactive-analyzer.js` 完成项目扫描与聚类。
5. **工程化复制**：参考 `YYC3-Next-React-多项目复用架构.md` 推广到多项目。

## 五、命名与格式约定

1. 文档统一命名为 `YYC3-{功能}-{描述}.md`，路径使用 ASCII `YYC3`。
2. 文件名禁止包含空格、`+`、`copy` 等临时标记。
3. `file` 字段必须与磁盘文件名一致，`title` 必须与正文 H1 一致。
4. 正文品牌统一写作 `YYC³`，路径与代码标识使用 ASCII `YYC3`。
5. 全部文档使用团队标准标头、5 行品牌标语与标准标尾；代码文件使用标准代码标头。

## 六、维护约定

1. 新增文档或代码文件必须同步更新本 README。
2. 重命名文件时，同步修改 front matter `file` 字段及所有引用链接。
3. 内容更新时递增 `version`、更新 `updated`，并在「变更历史」章节登记。
4. 提交前检查：标头字段完整、页脚一致、链接可达、代码语法通过。

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
| ---- | ---- | -------- | ---- |
| v1.0.0 | 2026-11-02 | 新建目录索引，纳入 10 份文档与 1 份代码文件 | YYC³ Team |

---

<p align="center">
  <b>YYC³</b>（YanYuCloudCube™ · 注册商标）<br>
  言启象限 | 语枢未来<br>
  <i>Words Initiate Quadrants, Language Serves as Core for Future</i><br>
  万象归元于云枢 | 深栈智启新纪元<br>
  <i>All things converge in cloud pivot; Deep stacks ignite a new era of intelligence</i><br>
  <sub>© 2026 YanYuCloudCube™（YYC³）· <a href="mailto:admin@0379.email">admin@0379.email</a></sub>
</p>
