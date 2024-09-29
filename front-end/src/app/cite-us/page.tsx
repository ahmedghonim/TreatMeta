"use client"
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {CircleLoader} from "react-spinners"

import { citationsJSON } from "./citations";

import {Cite} from "@citation-js/core"
import "@citation-js/plugin-doi"
import "@citation-js/plugin-csl"
import "@citation-js/plugin-ris"


import cloneDeep from 'lodash/cloneDeep';
import { downloadBlob } from "@/lib/utils";
import { Store } from 'react-notifications-component';

import { useState } from "react";

const citations=[
    {
        title:"Our Website",
        doi:'10.7717/peerj-cs.214'

    },
    {
        title:"Cochrane Handbook",
        doi:'10.1002/9781119536604'

    },
    {
        title:"Meta R Package",
        doi:'10.1007/978-3-319-21416-0'

    },
    {
        title:"Prepost Change",
        doi:'10.1002/sim.2423'

    },
    {
        title:"Median & IQR",
        doi:'10.1186/1471-2288-14-135'

    },
    {
        title:"Range",
        doi:'10.1186/1471-2288-5-13'

    },
    {
        title:"Inbetween Group P-Value",
        doi:'10.2307/2347681'

    },
    {
        title:"Unit Conversions",
        doi:'10.1056/NEJMcpc049016'

    }
];
const dois=citations.map((el:any)=>el.doi);

async function grabCitations(){
const data= Cite(JSON.parse(citationsJSON));
//const data = await Cite.async(dois, {maxChainLength:10});

// Format output
const segmentedData = citations.map((el:any, i:any)=> {
    const temp=cloneDeep(data);
    temp.data=[temp.data[i]];
    return temp;
});

const bibliography = segmentedData.map((el:any)=>el.format('bibliography', {
    format: 'html',
    template: 'apa',
    lang: 'en-US'
}));

const doc = bibliography.map((el:any)=>{
    const parser = new DOMParser();
    return parser.parseFromString(el, 'text/html').querySelector(".csl-entry")?.textContent;

});

return {dt: data, csl: doc};
}       

        

function Citation(
    {id,title,content, handler, currentActive}:
    {id:number, title:string, content:string, handler:any, currentActive:any}
){

    return(
        <>
            <div className="row flex">
                <div className="index flex flex-col">
                    
                    <Text size="tef" variant="white" className="mb-2">
                    {id}.
                  </Text>
                  <Input
                  className="w-5 h-5"
                  type="checkbox"
                  color="blue"
                  divStyle="justify-center"
                  name={"checkbox-"+id}
                  onChange={(e) => {
                    const temp=currentActive.slice();
                    temp[id-1] = e.target.checked;
                    handler(temp);
                    
                  }}
                />
                </div>
                <div className="record">
                <Text size="tef" variant="white" className="mb-2 block">
                    {title}
                  </Text>
                  {content}
                </div>
            </div>
        </>
    )
}


function Bibliography(){

    const [refs, setRefs] = useState<any>();
    const [csl, setCsl] = useState<any>();
    const [active, setActive] = useState<any>(citations.map((el:any)=>false));
    
    useEffect(()=>{
    async function init() {
        const dt= await grabCitations();
        setCsl(dt.csl);
        setRefs(dt.dt);
        console.log(dt);
    }
    init();

    },[])
   
      
      
    
    


    return(
<>
         <div className="flex flex-col justify-center items-center">

        
    <div className="mt-[10vh] flex flex-col justify-center items-start w-1/2">
              <Text size="te" variant="white" className="my-6 font-bold">
             How to cite us
                  </Text>
                  {
        <CircleLoader color="#f05445" loading={!csl} size={150} className="self-center" />
    }
                  {csl &&<div className="citation flex flex-col py-4">
    
      
           
            {citations.map((el:any, i:number)=> <Citation id={i+1} title={el.title} content={csl[i]} handler={setActive} currentActive={active}/>)}
           

    </div>}
 
    </div>
    <Button onClick={
        ()=>{
            if(active && active.reduce((a:any, c:any)=>a+c, 0) > 0){
                const temp = cloneDeep(refs);
                temp.data=temp.data.filter((el:any, i:any)=>active[i])
                downloadBlob(new Blob([temp.format("ris")]), "References.ris");}
                else{
                    Store.addNotification({
                        title: "Something went wrong!",
                        message: "You did not select any references",
                        type: "danger",
                        insert: "top",
                        container: "bottom-full",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: true,
                          pauseOnHover: true,
                        }
                      });
                }
        }
    } className="w-1/4 h-[54px] mt-8">
                  Download selected: { active.reduce((a:any, c:any)=>a+c, 0)}
                </Button>
  
    </div>
  
    </>
    );
}
 {/*  <span className="text-white mt-8 text-lg w-1/2">
  <strong>If you use our website to convert your data, please cite the following:</strong>   <br />

1- Our study about the website [WHEN PUBLISHED, put its citation]<br />

2- The study about the used conversion (you will find them in the guide)
    </span> */}


function CitePage() {
    return (
      <>
        <Bibliography />
      </>
    );
  }
  
  export default CitePage;