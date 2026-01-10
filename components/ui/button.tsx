import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
                outline:
                    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.98]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                // Matrix variants
                matrix:
                    "bg-transparent border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] active:scale-[0.98] font-mono",
                matrixSolid:
                    "bg-[#00ff41] text-black hover:bg-[#00cc33] hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] active:scale-[0.98] font-mono font-semibold",
                matrixDanger:
                    "bg-transparent border border-[#ff0040] text-[#ff0040] hover:bg-[#ff0040]/10 hover:shadow-[0_0_20px_rgba(255,0,64,0.3)] active:scale-[0.98] font-mono",
                matrixGhost:
                    "text-[#00ff41] hover:bg-[#00ff41]/10 font-mono",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-11 rounded-lg px-8 text-base",
                xl: "h-12 rounded-xl px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
