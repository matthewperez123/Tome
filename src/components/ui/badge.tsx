import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors duration-[var(--tome-duration-fast)] focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-offset-2 [&>svg]:pointer-events-none [&>svg]:size-3! motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tome-accent)] text-white",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-[var(--tome-error)]/10 text-[var(--tome-error)]",
        outline:
          "border-border text-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground",
        success:
          "bg-[var(--tome-success)]/10 text-[var(--tome-success)]",
        warning:
          "bg-[var(--tome-warning)]/10 text-[var(--tome-warning)]",
        link: "text-[var(--tome-accent)] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
