import React from "react"
import { Text } from "@/components/ui/text";
import Link from "next/link";
import { presets } from "@/components/layout/chared";

function PresetItem(
    {
        ID,
        url,
        Name,
        Description
    }
    :{
        ID:Number,
        url:string,
        Name:string,
        Description: string[]

    }){
    return(
        <div className="min-h-48">
            <Link
      href={`/start/${url}`}
      
    >
       <div className="py-4 px-6 rounded-md bg-[#1e304052] relative overflow-hidden hover:translate-y-2 hover:scale-[0.95] transform-gpu ease-in-out duration-300 h-full">
            <Text size="tee" variant="white">{Name}</Text>
            <ul className="list-disc text-white pl-6 mt-2">
                {Description.map((el:any, i:any)=> <React.Fragment key={i}>
                    <li key={i}>
                <Text size="base" variant="default">{el}</Text>
                </li>
                </React.Fragment>)}
            </ul>
            <Text variant="stroke-title" className="absolute right-[5%] bottom-[0px] translate-y-[30%] opacity-85">{ID+""}</Text>

       </div>
       </Link>
        </div>
    )
}


function PresetPage(){

    return(
        <>
        <Text variant="stroke-title">Presets</Text>
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 w-full mt-4 items-stretch">
            {presets.map((el:any, i:any)=><PresetItem key={i} ID={i+1} url={el.ID} Name={el.Name} Description={el.conversions}/>)}
        </div>
        </>
    )
}

export default PresetPage;
