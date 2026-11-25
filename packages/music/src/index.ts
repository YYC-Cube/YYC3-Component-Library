// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/music 桶文件 — Phase 1 导出面收敛（MIGRATION_PLAN v2.1）
//
// 【技术债登记】（A 线分诊 · 2026-11-10；Step 0 配置归一同日复核）
// 1. 17 个子目录（api/audio/auth/.../icp-verify）搬运时未建 barrel，待滚动抽取批次重建；
// 2. 顶层组件断链摘除：CoverFlow、AlbumCoverAdmin、App（引用包根不存在的
//    ../hooks/../types/../data/../services/ 与 ./components/*，源项目根目录文件未随迁）；
// 3. 保留导出 = 链路完整：Player（含 SimpleBackgroundVideo）、BackgroundVideo、SearchBar、error-boundary；
// 4. 门禁口径：tsconfig.include 已收敛到上述公开面闭包（6 文件），其余 391 个文件
//    （src/api、src/app、src/login、3D/Mantine/Figma 资产等）登记为「未随迁债」。
//    Step 0 补 46 项依赖声明 + `@/*` 别名 + motion/react → framer-motion 后，
//    全量 include 错误 1,185 → 640（公开面仍为 0）；剩余缺口均为上游应用件
//    （../hooks/useI18n 32、../lib/supabase 25、r3f/three 37、@mantine/* 14、figma:asset/* 25）。
// 5. ui 副本去重（2026-11-10，D1 口径逐件 diff）：src/app/components/ui 48 件副本已删除，
//    122 处引用改指 `@yyc3/ui/<name>`。判据：48 件与权威源「无一件 MD5 相同」，但本地件
//    均为权威版的旧子集（无本地独有导出、行数普遍 -4 起，缺 button 的 icon-sm/icon-lg、
//    ButtonProps/InputProps 类型与 shadow-xs 等增量），故按「权威版择优」处置，0 件回灌。
//    真实被引用的只有 8 个基元（button/input/textarea/slider/tabs/avatar/label/card），
//    其余 40 件属死副本。接受代价：select 宽度（w-full → w-fit）、button 阴影等视觉微差，
//    以全仓 8 个包共用的 @yyc3/ui 为准。
//    重建这些目录时需同步恢复 include 并单独出包。
export * from './Player';
export * from './BackgroundVideo';
export * from './SearchBar';
export * from './error-boundary';
