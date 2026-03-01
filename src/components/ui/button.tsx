import * as React from "react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/src/lib/utils"

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">>,
    HTMLMotionProps<"button"> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-[#977DFF] to-[#0033FF] text-white shadow-lg shadow-primary/20 hover:shadow-primary/40": variant === "default",
            "border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-slate-200": variant === "outline",
            "hover:bg-white/10 text-slate-200": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-secondary text-white hover:bg-secondary/80": variant === "secondary",
            "h-12 px-8 py-3": size === "default",
            "h-9 rounded-full px-4": size === "sm",
            "h-14 rounded-full px-10 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
