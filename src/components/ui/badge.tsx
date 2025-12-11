import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
      secondary: "bg-git-secondary/10 text-git-secondary hover:bg-git-secondary/20",
      success: "bg-git-primary/10 text-git-primary hover:bg-git-primary/20",
      warning: "bg-yellow-100 text-yellow-900 hover:bg-yellow-100/80",
      danger: "bg-git-danger/10 text-git-danger hover:bg-git-danger/20",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
