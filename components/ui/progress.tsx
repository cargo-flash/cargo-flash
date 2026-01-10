"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
        variant?: 'default' | 'matrix'
    }
>(({ className, value, variant = 'default', ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            "relative h-2 w-full overflow-hidden rounded-full",
            variant === 'default' && "bg-primary/20",
            variant === 'matrix' && "bg-[#00ff41]/10",
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className={cn(
                "h-full w-full flex-1 transition-all duration-500 ease-out",
                variant === 'default' && "bg-primary",
                variant === 'matrix' && "bg-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.5)]"
            )}
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
