import React from "react";
import { Text } from "@/components/ui/text";

function Bibliography(){


    return(
        <div className="flex flex-col justify-center items-center">

        
    <div className="mt-[10vh] flex flex-col justify-center items-start w-1/2">
              <Text size="te" variant="white" className="my-6 font-bold">
             How to cite us
                  </Text>
    <table className="table-auto border-collapse">
    
        <tbody>
            <tr >
                <td className="w-1/6 font-bold">
                    1.
                </td>
                <td className="font-normal text-justify py-4 pr-16">
                Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, Page MJ, Welch VA (editors). Cochrane Handbook for Systematic Reviews of Interventions version 6.4 (updated August 2023). Cochrane, 2023. Available from www.training.cochrane.org/handbook.
                </td>
            </tr>
            <tr >
                <td className="w-1/6 font-bold">
                    2.
                </td>
                <td className="font-normal text-justify py-4 pr-16">
                Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, Page MJ, Welch VA (editors). Cochrane Handbook for Systematic Reviews of Interventions version 6.4 (updated August 2023). Cochrane, 2023. Available from www.training.cochrane.org/handbook.
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>
    );
}



function CitePage() {
    return (
      <>
    <Bibliography
      
    />
      </>
    );
  }
  
  export default CitePage;