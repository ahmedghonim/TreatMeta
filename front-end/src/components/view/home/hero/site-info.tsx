import { Text } from "@/components/ui/text";
import React from "react";

function SiteInfo() {
  return (
    <div className=" bg-[#1E3040] w-full p-6 md:py-[50px] md:pe-11 md:ps-[118px] flex flex-col md:flex-row items-start justify-between">
      {/* <Item number={545} label="Visitors" />
      <Item number={20} label="Conversions" />
      <Item number={100} label="New Users" operation="K+" /> */}
    </div>
  );
}

function Item({
  number,
  label,
  operation = "+",
}: {
  number: number;
  operation?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-start">
      <Text variant="white" size="f2">
        {number}
        {operation}
      </Text>
      <Text variant="white">{label}</Text>
    </div>
  );
}

export default SiteInfo;
