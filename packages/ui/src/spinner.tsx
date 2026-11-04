// YYC³ · @yyc3/ui Spinner（Phase 4 · S2 补入）
// 源：personal 副本 YYC3-UI-用户界面/Button/components/ui/spinner.tsx（shadcn 新版）
import type * as React from 'react'
import { Loader2Icon } from 'lucide-react'

import { cn } from '../lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
