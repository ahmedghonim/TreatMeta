import React from "react";
import ReactSelect, { Props } from "react-select";
import ReactSelectTheme from "./ReactSelectTheme";

export interface Options {
  value: string | number;
  label: string | number;
}

interface SelectProps extends Props {
  options: Options[];
  isForm?: boolean;
  label?: string;
}

function Select({
  options,
  className = "",
  label,
  isForm,
  name = "",
  required,
  ...props
}: SelectProps) {
  return (
    <div
      className={`w-full flex flex-col ${
        props.isDisabled === true ? "!opacity-100 !cursor-not-allowed" : ""
      }`}
    >
      {Boolean(label) && (
        <label htmlFor={name} className="pb-2 text-[12px] text-white">
          {label}
        </label>
      )}
      <ReactSelect
        id="long-value-select"
        instanceId="long-value-select"
        options={options}
        styles={ReactSelectTheme("light")}
        {...props}
        classNamePrefix={`select2-selection text-sm ${
          props.isDisabled === true ? "!opacity-100 " : ""
        }
         `}
        className={`w-full ${className}`}
      />
    </div>
  );
}

export default Select;
