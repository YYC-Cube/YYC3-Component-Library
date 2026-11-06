// ============================================================
// YYC³ · @yyc3/medical utils cn（medical T2/T3 批次 · 2026-11-06）
// 源语义（D0 权威副本）：/Users/yanyu/YYC3-Knowledge-Base/YYC3-UI-9/YYC-cloud-platform/lib/utils.ts
// 的 cn（clsx + tailwind-merge 标准实现）——消费面 5 处（patient-navigation/
// patient-list/followup-client/ai-diagnosis-navigation/model-navigation），
// 以包内自足落位替代 @yyc3/lib/utils 子路径（lib exports 无 "./utils" 映射）。
// ============================================================
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
