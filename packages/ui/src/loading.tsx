/**
 * file: loading.tsx
 * description: 工作区多数派规范件 · 覆盖 13 个项目逐字节一致
 * author: YYC3 Team
 * version: v0.1.1
 * created: 2026-11-07
 * updated: 2026-11-27
 * status: active
 * tags: [component],[ui],[shared]
 *
 * copyright: YanYuCloudCube(TM)（YYC3）
 * notes: 由工作区多数派规范件提取生成（经 Mimosa 扫描脚本执行）。
 *   v0.1.1 修复：原实现恒返回 null（active 规范件无渲染输出，见 PR#56 产品 bug 清单）——
 *   现按多数派规范渲染居中转圈 +「加载中...」文案；active prop 可控关断（默认开）。
 */

export default function Loading({ active = true }: { active?: boolean }) {
  if (!active) return null
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-blue-600" />
        <p className="text-sm text-zinc-500">加载中...</p>
      </div>
    </div>
  )
}
