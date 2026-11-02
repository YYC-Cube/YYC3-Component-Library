"use client"

import * as React from "react"
import { Button } from "@yyc3/ui/button"
import { cn } from "@yyc3/lib/utils"

interface AccessibleButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
  loadingText?: string
  description?: string
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ className, children, loading, loadingText, description, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <Button
        ref={ref}
        className={cn(
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "transition-all duration-200",
          className,
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-describedby={description ? `${props.id}-description` : undefined}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2" aria-hidden="true">
              ⟳
            </span>
            {loadingText || "加载中..."}
          </>
        ) : (
          children
        )}
        {description && (
          <span id={`${props.id}-description`} className="sr-only">
            {description}
          </span>
        )}
      </Button>
    )
  },
)
AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton }
