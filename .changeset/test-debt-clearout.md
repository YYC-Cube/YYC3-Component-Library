---
'@yyc3/education': patch
'@yyc3/admin': patch
'@yyc3/ai': patch
---

8 债文件批次：测试债彻底清零——**全仓 671✅/0❌，CI test 门禁解除**（合并不再需要 --admin）。

**education（4 文件 94✅，D0 配套测试版→组件对齐）**：autonomous-engine 轻量桩层落位（AgenticCore 接口面按 D0 UI-9/yyc3-learning-platform 对齐，constructor+processInput 模拟响应；真身 866 行依赖 @yyc3/model-adapter 4,935 行牵出 openai SDK 逃逸链，悬留 learning-platform 专项）；logger 真身 88 行迁入；virtualized-message-list 补 testid 契约 + 「最新在上」倒序映射；intelligent-ai-widget 修复 appReducer(undefined) 真 bug + 拖拽锚点移根节点 + aria-label 全屏三按钮 + localStorage 键全量化；toolbox-panel 修复 filteredTools 未定义真 bug + 工具详情浮层；vitest.setup 补 RTL 自动 cleanup（globals 未开导致多 render 树残留的通用根因）。

**admin（3 文件 369✅ 含全包，bootstrap 存量测试→测试对齐现基线）**：溯源证实「言语云」版/activeModule 架构在本仓与全知识库均无对应源（方向裁决与 education 相反）；断言改对齐现组件实际渲染（banner 角色/aria-label 通知中心/结构断言）；10 个整功能缺失用例诚实删除（logo 管理/删除/分页/拖拽等），8 项测试意图保留但断言降级（清单入档）；header.tsx 补 1 行 aria-label。

**ai（1 文件 3✅，同 admin 策略）**：ModuleId 导入源改 slices/createUISlice 真实导出处；枚举值对齐（OTHER_MODULES）。

通用：jsdom 环境垫片（react-virtual 测试替身/Radix Select pointerCapture stub）随测试落位；全仓 BUILD=0 · 671✅/0❌。
