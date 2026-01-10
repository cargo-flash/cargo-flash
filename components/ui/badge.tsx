import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground",
                outline: "text-foreground",
                // Status variants
                pending: "border-amber-200 bg-amber-100 text-amber-800",
                collected: "border-blue-200 bg-blue-100 text-blue-800",
                in_transit: "border-indigo-200 bg-indigo-100 text-indigo-800",
                out_for_delivery: "border-purple-200 bg-purple-100 text-purple-800",
                delivered: "border-emerald-200 bg-emerald-100 text-emerald-800",
                failed: "border-red-200 bg-red-100 text-red-800",
                returned: "border-gray-200 bg-gray-100 text-gray-800",
                // Matrix variants
                matrix: "border-[#00ff41]/30 bg-[#00ff41]/10 text-[#00ff41] font-mono",
                matrixCyan: "border-[#00ffff]/30 bg-[#00ffff]/10 text-[#00ffff] font-mono",
                matrixAmber: "border-[#ffb000]/30 bg-[#ffb000]/10 text-[#ffb000] font-mono",
                matrixRed: "border-[#ff0040]/30 bg-[#ff0040]/10 text-[#ff0040] font-mono",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
