#!/usr/bin/env python3
# ============================================================
# YYC³（YanYuCloudCube™ · 注册商标）
# 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
# ============================================================
# Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
# ============================================================
# @File    : extraction-filter.py
# @Desc    : 抽取过滤器（执行衔接手册 §四步3/步5 前置）— 剔除构建产物/依赖树/上游快照
#            用法：find <源目录> -type f | python3 scripts/extraction-filter.py
#                  （stdin 逐行文件路径；放行者输出到 stdout，拒绝者归因到 stderr）
# ============================================================
import sys
from pathlib import Path

REJECT_PARTS = {  # 构建产物与依赖树
    "node_modules", "dist", "build", "out", ".next", ".turbo", ".cache", "coverage",
}
REJECT_SUFFIX = (".js", ".js.map", ".mjs", ".cjs", ".d.ts", ".d.ts.map", ".map",
                 ".log", ".DS_Store", ".tsbuildinfo")
REJECT_NAMES = {  # 上游快照（评估报告 §5.1 剔除清单）
    "yyc-joomla", "code-skills", "音效系统", "nvidia", "NVIDIA Nsight Compute",
    "nuxt-commerce-main", "libunity-master", "setup-scripts-main", "r8152-2.16.0",
    "New Components - shadcn", "Mcp-Edge",
}
KEEP_SUFFIX = (".ts", ".tsx", ".css", ".scss", ".json", ".md", ".svg", ".png",
               ".jpg", ".webp", ".woff2")


def verdict(p: str) -> tuple[bool, str]:
    path = Path(p)
    parts = set(path.parts)
    if parts & REJECT_PARTS:
        return False, "构建产物/依赖树目录"
    if path.name in REJECT_NAMES or any(n in parts for n in REJECT_NAMES):
        return False, "剔除清单（上游快照/素材）"
    if path.suffix in REJECT_SUFFIX:
        return False, "构建产物后缀"
    if path.name == "package-lock.json" or path.name == "pnpm-lock.yaml":
        return False, "锁文件"
    if path.suffix not in KEEP_SUFFIX:
        return False, "非白名单后缀"
    return True, ""


def main() -> None:
    for line in sys.stdin:
        f = line.rstrip("\n")
        if not f:
            continue
        ok, why = verdict(f)
        if ok:
            print(f)
        else:
            print(f"REJECT\t{why}\t{f}", file=sys.stderr)


if __name__ == "__main__":
    main()
