# @yyc3/music

> YYC³ 音乐娱乐域组件库 — 播放器/封面流/搜索 · Phase 1 固化（2026-11-04）

## 状态

- src 文件：417 · 构建：✅ tsup（dts；18~21KB 真实产物）
- 测试：2 个文件 · 依赖：lucide-react / framer-motion（Phase 1 补声明）

## 有效导出（Phase 1 收敛）

`Player`（含 SimpleBackgroundVideo）、`BackgroundVideo`、`SearchBar`、`error-boundary`——桶文件见 `src/index.ts`。

## 来源

主库 UI 池（AlbumCoverAdmin/CoverFlow ← YYC3-Music/Music/D-Music-e/Music-Vynora-Community；icp-verify ← yy-music，评估报告 §4.1）。

## 技术债（重要）

1. 17 个子目录无 barrel（api/audio/auth/community/…），待滚动抽取批次重建；
2. 断链摘除待重评：CoverFlow、AlbumCoverAdmin、App（引用包根未随迁的 ../hooks/../types/../data/../services/）；
3. RankingBoard 依赖 framer-motion（已装）但其测试仍在失配清单。
