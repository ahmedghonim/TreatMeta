import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  divStyle?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label,divStyle, name,...props }, ref) => {
    return (
      <div className={cn("relative flex w-full flex-1 flex-col", divStyle)}>
        {label && (
          <label htmlFor={name} className="pb-2 text-[12px] text-white">
            {label}
          </label>
        )}
        <input
          type={type}
          name={name}
          className={cn(
            "flex h-[54px] w-full text-base font-bold rounded bg-[#48647D3D] text-primary px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
