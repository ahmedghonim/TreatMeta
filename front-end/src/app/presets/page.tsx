import React from "react"
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { presets } from "@/components/layout/chared";
import "./presets.css"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Presets",
    description: "Quick-start presets for common meta-analysis data conversions. Mean and SD, effect size estimation, combining groups, lab conversions, and individual patient data summary.",
    openGraph: {
        title: "Conversion Presets | TreatMeta",
        description: "Quick-start presets for common meta-analysis data conversions including effect sizes, mean/SD, and more.",
    },
};

function PresetItem(
    {
        ID,
        url,
        Name,
        Sub,
        Description
    }
        : {
            ID: Number,
            url: string,
            Name: string,
            Sub?: string,
            Description: string[]

        }) {

    return (
        <div className="min-h-48">
            <Link
                href={`/start/${url}`}

            >
                <div className="preset-item py-4 px-6 rounded-md bg-[#1e304052] relative overflow-hidden h-full">
                    <Text size="tee" variant="white"><div dangerouslySetInnerHTML={{ __html: Name }} /></Text>
                    {Sub && <Text size="et" variant="default" className="block text-gray-400 font-bold">{Sub}</Text>}
                    <ul className="list-disc text-white pl-6 mt-2">
                        {Description.map((el: any, i: any) => <React.Fragment key={i}>
                            <li key={i}>
                                <Text size="base" variant="default">{el}</Text>
                            </li>
                        </React.Fragment>)}
                    </ul>
                    <Text variant="stroke-title" className="number absolute right-[5%] bottom-[0px] translate-y-[30%] opacity-85">{ID + ""}</Text>

                </div>
            </Link>
        </div>
    )
}


function PresetPage() {

    return (
        <>
            <Text variant="stroke-title">Presets</Text>
            <div className="presets grid md:grid-cols-3 sm:grid-cols-1 gap-x-4 gap-y-6 w-full mt-4 items-stretch">
                {presets.map((el: any, i: any) => <PresetItem key={i} ID={i + 1} url={el.ID} Name={el.Name} Description={el.conversions} Sub={el.sub} />)}
            </div>
        </>
    )
}

export default PresetPage;
