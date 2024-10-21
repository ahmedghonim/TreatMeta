import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const TextVariants = cva(
  "inline-flex justify-center !leading-normal items-center whitespace-normal rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        primary: "text-primary",
        default: "text-dark",
        "stroke-title": "stroke",
        white: "text-white",
      },

      center: {
        true: "!text-center",
      },

      size: {
        fe: "text-2xl md:text-[48px] font-bold",
        f2: "text-xl md:text-[42px] font-bold",
        te: "text-xl md:text-[38px]",
        teb: "text-xl md:text-[38px] font-bold",
        tee: "md:text-[28px]  text-base font-bold",
        tef: "md:text-[24px] text-base font-bold",
        default: "md:text-xl text-sm",
        base: "text-base",
        et: "text-lg",
        sm: "text-sm",
        xs: "text-xs font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof TextVariants> {
  asChild?: boolean;
  as?: React.ElementType;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant, size, center, asChild = false, as, ...props }) => {
    const Comp = as ? as : "span";
    return (
      <Comp
        className={cn(TextVariants({ variant, size, center, className }))}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text, TextVariants };
