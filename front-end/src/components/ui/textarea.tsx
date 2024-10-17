import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea = ({ className, label, name, ...props }: TextAreaProps) => {
  return (
    <div className={cn("relative flex w-full flex-1 flex-col")}>
      {label && (
        <label htmlFor={name} className="pb-2 text-[12px] text-white">
          {label}
        </label>
      )}
      <textarea
        name={name}
        className={cn(
          "flex w-full rounded bg-[#48647D3D] text-primary px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ",
          className
        )}
        {...props}
      />
    </div>
  );
};

export { TextArea };
