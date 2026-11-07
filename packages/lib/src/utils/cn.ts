/**
 * file: utils.ts
 * description: 工作区多数派规范件 · 覆盖 13 个项目逐字节一致
 * author: YYC3 Team
 * version: v0.1.0
 * created: 2026-11-07
 * updated: 2026-11-07
 * status: active
 * tags: [util],[shared]
 *
 * copyright: YanYuCloudCube(TM)（YYC3）
 * notes: 由工作区多数派规范件提取生成（经 Mimosa 扫描脚本执行）
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
