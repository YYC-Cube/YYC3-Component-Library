// ============================================================
// YYC³ · shadcn 新版升级 Layer3（升级专项批次 A · 2026-11-07）
// 源（shadcn 新版）：personal 副本 YYC3-D/Button/components/ui/input.tsx
// ============================================================
import * as React from 'react'

import { cn } from '../lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

// 兼容 shim（升级专项批次 A）：恢复旧版公开类型导出面（index.ts ClawInputProps 再导出锚点）
export type InputProps = React.ComponentProps<'input'>

export { Input }
