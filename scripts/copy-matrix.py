#!/usr/bin/env python3
# ============================================================
# YYC³（YanYuCloudCube™ · 注册商标）
# 言启象限 | 语枢未来 · Words Initiate Quadrants, Language Serves as Core for Future
# ============================================================
# Copyright (c) 2026 YanYuCloudCube™（YYC³）| admin@0379.email
# ============================================================
# @File    : copy-matrix.py
# @Desc    : Phase 2 主库普查 — 十池 depth-1 项目副本矩阵与权威副本指定
#            数据源：/Users/yanyu/YYC3-Knowledge-Base（主库，绝对路径，G9 铁律）
#            用法：python3 scripts/copy-matrix.py > matrix.md（或 --json 输出机读）
# ============================================================
import json
import sys
from pathlib import Path

KB = Path("/Users/yanyu/YYC3-Knowledge-Base")  # 主库（唯一迁移源 A，勿用 YYC3-D 等）
POOLS = ["YYC3-UI", "YYC3-UI-1", "YYC3-UI-2", "YYC3-UI-3", "YYC3-UI-4",
         "YYC3-UI-5", "YYC3-UI-6", "YYC3-UI-7", "YYC3-UI-8", "YYC3-UI-9"]

# 权威副本优先级（MIGRATION_PLAN v2.1 §2.1）：UI-9 最全 > UI-8 组件库工作区 >
# UI-6/UI-1/UI 历史快照 > UI-4/UI-5 孪生二选一（取 UI-4）；UI-3 策展版仅参考不计权威
PRIORITY = ["YYC3-UI-9", "YYC3-UI-8", "YYC3-UI-6", "YYC3-UI-1", "YYC3-UI", "YYC3-UI-4"]

# 剔除清单（评估报告 §5.1：上游快照/素材，永不入迁移分母）
EXCLUDED = {
    "yyc-joomla", "code-skills", "音效系统", "nvidia", "NVIDIA Nsight Compute",
    "nuxt-commerce-main", "libunity-master", "setup-scripts-main", "r8152-2.16.0",
    "New Components - shadcn", "Mcp-Edge",
}
EXCLUDED_PREFIX = ("nvidia",)


def scan() -> dict:
    matrix: dict[str, list[str]] = {}
    for pool in POOLS:
        d = KB / pool
        if not d.is_dir():
            continue
        for child in d.iterdir():
            if child.is_dir() and child.name != ".DS_Store":
                matrix.setdefault(child.name, []).append(pool)
    return matrix


def authoritative(pools: list[str]) -> str | None:
    for p in PRIORITY:
        if p in pools:
            return p
    return None  # 仅存在于 UI-2/UI-3/UI-5/UI-7 等低优先池


def main() -> None:
    matrix = scan()
    rows = []
    for name, pools in sorted(matrix.items(), key=lambda x: (-len(x[1]), x[0])):
        auth = authoritative(pools)
        excluded = name in EXCLUDED or name.startswith(EXCLUDED_PREFIX)
        rows.append({
            "name": name, "copies": pools, "count": len(pools),
            "authoritative": auth, "excluded": excluded,
        })

    if "--json" in sys.argv:
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=1)
        return

    multi = [r for r in rows if r["count"] >= 2]
    print(f"| 项目名 | 副本数 | 副本所在 | 权威副本 | 备注 |")
    print(f"| --- | ---: | --- | --- | --- |")
    for r in rows:
        loc = "、".join(r["copies"])
        auth = r["authoritative"] or "⚠️ 无高优副本（见低优池）"
        note = "🚫 剔除清单" if r["excluded"] else ("" if r["count"] == 1 else "")
        print(f"| {r['name']} | {r['count']} | {loc} | {auth} | {note} |")
    print(f"\n<!-- 统计：共 {len(rows)} 个项目名；≥2 副本 {len(multi)} 个 -->",
          file=sys.stderr)


if __name__ == "__main__":
    main()
