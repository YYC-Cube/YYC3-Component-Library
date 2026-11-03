// ============================================================
// YYC³（YanYuCloudCube™ · 注册商标）
// 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
// ============================================================
// Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
// ============================================================
// @yyc3/music 桶文件 — Phase 1 导出面收敛（MIGRATION_PLAN v2.1）
//
// 【技术债登记】
// 1. 17 个子目录（api/audio/auth/.../icp-verify）搬运时未建 barrel，待滚动抽取批次重建；
// 2. 顶层组件断链摘除：CoverFlow、AlbumCoverAdmin、App（引用包根不存在的
//    ../hooks/../types/../data/../services/ 与 ./components/*，源项目根目录文件未随迁）；
// 3. 保留导出 = 链路完整：Player（含 SimpleBackgroundVideo）、BackgroundVideo、SearchBar、error-boundary。
export * from './Player';
export * from './BackgroundVideo';
export * from './SearchBar';
export * from './error-boundary';
