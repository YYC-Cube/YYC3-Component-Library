# @yyc3/education

> YYC³ 教育学习域组件库 — 智能助教/虚拟列表/考试 · Phase 1 固化（2026-11-04）

## 状态

- src 文件：62 · 构建：✅ tsup（dts）· 依赖：lucide-react / @tanstack/react-virtual（Phase 1 补声明）
- 测试：4 个文件（intelligent-ai-widget 系——部分跨包断链债，见下）

## 来源

主库 UI 池（exam-assistant/deepseek-themes ← YYC-Learning-Hub（UI-2/5/7）、yyc3-learning-platform（UI-7/9），评估报告 §4.1）。

## 技术债

`../../packages/autonomous-engine/...` 跨包相对断链（源项目兄弟目录未随迁）——intelligent-ai-widget 依赖自治引擎，Phase 2 权威副本甄别时一并定位真身。
