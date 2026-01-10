import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default' | 'matrix'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                    variant === 'matrix' && [
                        "bg-[#0d1117] border-[#00ff41]/30 text-[#00ff41]",
                        "placeholder:text-[#00ff41]/40 font-mono",
                        "focus:border-[#00ff41] focus:ring-[#00ff41]/20",
                        "focus:shadow-[0_0_10px_rgba(0,255,65,0.2)]",
                    ],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
