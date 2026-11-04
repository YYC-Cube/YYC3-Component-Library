---
'@yyc3/ui': minor
---

Phase 4 shadcn 去重：S2 逐件 diff 完成（56 文件 D1 清单留档 docs/YYC3-Phase4-shadcn去重-D1清单.md）。**7 件缺失补入**（shadcn 新版）：ButtonGroup/Empty/Field/InputGroup/Item/Kbd/Spinner（837 行，import 适配+React 类型补齐，UI build=0 一次通过）。**49 件 SKIP**（同名保留本仓活基线；shadcn 新版整体升级列独立专项——全局 token 变化需消费方全量回归）。新增冒烟覆盖 7 件导出。
