"use client";
import { Text } from "@/components/ui/text";
import React from "react";
import Icon1 from "@/svg/mean_and_standard_deviation";
import Icon2 from "@/svg/effect_size_estimation";
import Icon3 from "@/assets/svg/mean_and_SD_calculation3";
import Icon4 from "@/assets/svg/mean_and_SD_combination2";
import Icon5 from "@/svg/units_and_labs_conversions";
import { cn } from "@/lib/utils";
import Link from "next/link";

function OurConversions() {
  const mData = {
    id: "MeanSdOps",
    icon: Icon1,
    title: "Mean and standard deviation (SD) conversions",
    list: [
      "Mean and confidence interval (CI)",
      "Mean and standard error (SE)",
      "Median and range",
      "Median and inter quartile range (IQR)",
      "P value of difference between groups",
      "P value of difference between groups",
    ],
  };

  const data = [
    {
      id: "TeSe",
      icon: Icon2,
      title: "Effect size estimation",
      list: [
        "Indirect meta-analysis",
        "Prevalence (proportions) meta-analysis",
        "Dichotomous data pooling",
        "Continuous data pooling",
      ],
    },
    {
      id: "IPD",
      icon: Icon3,
      title: "Data for each patient",
      list: ["From data for each patient into mean and SD"],
    },

    {
      id: "CombineMeans",
      icon: Icon4,
      title: "Mean and SD combination",
      list: ["From two or more groups into single mean and SD"],
    },
    {
      id: "Labs",
      icon: Icon5,
      title: "Units and labs conversions",
      list: [
        "More than 150 lab and units conversions such as hormones, blood sugar, length, weight, and many others.",
      ],
    },
  ];

  return (
    <div className="relative flex items-center mt-10 md:h-screen md:mt-0">
      <div className="flex-1 space-y-7">
        <Text variant="stroke-title">Available Conversions</Text>
        <div className="w-full gap-4 space-y-4 md:grid md:space-y-0 md:grid-cols-12">
          <div className="col-span-8 gap-4 space-y-4 md:grid md:space-y-0 md:grid-cols-12 ">
            {data.map((item, index) => (
              <div
                key={item.title}
                className={cn("col-span-4", {
                  "col-span-8": index === 0 || index === 3,
                })}
              >
                <Item
                  id={item.id}
                  icon={item.icon}
                  title={item.title}
                  list={item.list}
                />
              </div>
            ))}
          </div>
          <div className="col-span-4">
            <Item
              icon={mData.icon}
              title={mData.title}
              list={mData.list}
              id={mData.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({
  icon: Icon,
  title,
  list,
  id,
}: {
  id: string | null;
  icon: any;
  title: string;
  list: string[];
}) {
  return (
    <Link
      href={`/start/${id}`}
      className={cn(
        "p-4 bg-[#1e304052] h-full rounded-md space-y-1 cursor-pointer block hover:bg-primary duration-300"
      )}
    >
      <div className="space-y-3">
        <Icon width={32} height={32} className="fill-white" />
        <Text size="tee" variant="white">
          {title}
        </Text>
      </div>
      <ul className="space-y-3">
        {list.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-start gap-2 hover:text-white duration-300 "
            )}
          >
            <Text className="hover:!text-white" size="base">
              •
            </Text>
            <Text className="hover:!text-white" size="base">
              {item}
            </Text>
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default OurConversions;
