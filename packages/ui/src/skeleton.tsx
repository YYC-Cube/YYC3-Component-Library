// ============================================================
// YYC³ · shadcn 新版升级 Layer2（升级专项批次 B · 2026-11-07）
// 源（shadcn 新版）：personal 副本 YYC3-D/Button/components/ui/skeleton.tsx
// ============================================================
import { cn } from '../lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
