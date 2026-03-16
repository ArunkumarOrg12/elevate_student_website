import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-indigo-100 text-indigo-700",
        secondary: "bg-gray-100 text-gray-700",
        destructive: "bg-red-100 text-red-700",
        outline: "border border-gray-200 text-gray-700",
        technical: "bg-blue-100 text-blue-700",
        aptitude: "bg-emerald-100 text-emerald-700",
        behavioral: "bg-violet-100 text-violet-700",
        communication: "bg-amber-100 text-amber-700",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
