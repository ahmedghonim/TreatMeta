"use client";
import { useState, useEffect } from "react";
import Line from "@/assets/svg/line";
import { first, keys, zipObject } from "lodash";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { registerAllModules } from "handsontable/registry";
import HandsonTable from "@/components/ui/handson-table";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/lib/fetchData";
import Select from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { presets } from "@/components/layout/chared";
import { Store } from 'react-notifications-component';
import { Tooltip } from 'react-tooltip'


export default function StartPage({params}:{params: {slug:string}}) {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const router = useRouter();
  const  slug  = params.slug;

  registerAllModules();
  const [firstInput, setFirstInput] = useState<any>({
    current_prepost: "0",
  });

  const [openSelect, setOpenSelect] = useState<any>(false);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);
  const [selectTypes, setSelectTypes] = useState<any>([]);
  const [inputParams, setInputParams] = useState<any>(null);
  const [funcIdsValues, setFuncIdsValues] = useState<any>(null);
  const [outputVariables, setOutputVariables] = useState<any>(null);
  const [invalidRows, setInvalidRows] = useState<any>(null);
  const [getDataTable, setGetDataTable] = useState<any>([]);
  const [tableResult, setTableResult] = useState<any>([]);
  const [outputColumns, setOutputColumns]= useState<any>([]);
  const [sleetedUserIndex, setSleetedUserIndex] = useState<any>([]);
  const [availableCategoriesData, setAvailableCategoriesData] = useState<any>(
    []
  );
  const [currentPresets, setCurrentPresets] = useState<any>([]);

  const [category, setCategory] = useState([]);
  const [labData, setLabData] = useState<any>([]);
  useEffect(() => {
    setCurrentPresets(presets);

  }, [slug]);

  useEffect(() => {
    if (slug !=="default" && currentPresets.length > 0) {
      const fInput = currentPresets.find((x:any)=>x.ID==slug);
      setFirstInput({
        current_groups: fInput.groups+"",
        category: fInput.category+"",
        current_prepost: fInput.prepost+""
      });
    }
  }, [currentPresets]);

  useEffect(() => {
    if (Object.keys(firstInput).length == 3 && slug !=="default") {
      handleFirstInput();
      const fInput = currentPresets.find((x:any)=>x.ID==slug);
      console.log(fInput.prepost, fInput.groups, fInput.category, "there")
      renameVariables(fInput.prepost, fInput.groups, fInput.category, fInput.colnames).then(
        (res: any) => {
          const selectedCategory = fInput.colnames.map((item: any, i: any) => {
            return { value: item, label: res[i] };
          });
          setSelectedCategory(selectedCategory);
        }
      );
    }
  }, [firstInput]);
  useEffect(() => {
    if (inputParams && selectedCategory.length && slug !=="default") {

      handleFunc_IDs();
    }
  }, [inputParams, selectedCategory]);
  useEffect(() => {
    fetchData("/available_categories").then((data: any) => {
      setAvailableCategoriesData(
        data.data.map((item: any) => ({
          value: item.ID,
          label: item.Name,
        }))
      );

      fetchData("/labs").then((data: any) => {
        setLabData(
          data.data.map((item: any) => ({
            value: item.ID,
            label: item.Conversion,
          }))
        );
      });
    });
  }, []);


  function handleInvalidRows(rows:any, colnum:number, classstr:string){
    let outputCells=[];
  
    for(let i=0; i < rows.length; i++){
      for(let j=0; j < colnum; j++){
      outputCells.push({
        row:rows[i]-1,
        col:j,
        className: classstr
      });
      }
    
    }
    return outputCells;

  }

  async function handleFirstInput() {
    try {
      const { data } = await fetchData<any>("/eligible_functions", {
        method: "POST",
        body: firstInput,
      });

      const keys = data[0][1];
      const values = data[0][0];

      const categoryValue = keys.map((key: any, i: any) => {
        return { value: values[i], label: key };
      });
      setInputParams(data[1]);

      setCategory(categoryValue);
      setSelectTypes(data[2]);
      const selectedObject: any = {};
      data[2].forEach(
        (item: any, index: any) => (selectedObject[values[index]] = item)
      );

      setSleetedUserIndex(selectedObject);
    } catch (e) {
      console.log(e);
    }
  }
  //Rename variables
  async function renameVariables(
    prepost: boolean,
    groups: number,
    category: number,
    vars: Array<string>
  ) {
    try {
      const { data } = await fetchData<any>("/Rename_variables", {
        method: "POST",
        body: {
          var_names: JSON.stringify(vars),
          current_groups: groups,
          current_prepost: prepost,
          category: category
        },
      });
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  //FuncIDs
  async function handleFunc_IDs() {
    const categoryValue = selectedCategory.map((item: any) => {
      return item.value;
    });
    try {
      const { data } = await fetchData<any>("/Func_IDs", {
        method: "POST",
        body: {
          user_inputs: JSON.stringify(categoryValue),
          input_params: JSON.stringify(inputParams),
          current_prepost: firstInput.current_prepost,
          category: firstInput?.category,
        },
      });
      setFuncIdsValues(data);

      const { data: outputVariables } = await fetchData<any>(
        "/Output_variables",
        {
          method: "POST",
          body: {
            funcIDs: JSON.stringify(data[1]),
          },
        }
      );
      setOutputVariables(outputVariables);
    } catch (e) {
      Store.addNotification({
        title: "Something went wrong!",
        message: "You selection doesn't match available conversions.\n Please refer to the guide for more info.",
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
      console.log(e);
    }
  }
  useEffect(() => {
    const oldLocalGetDataTable = localStorage.getItem("getDataTable");

    const oldLocalSelectedCategory = localStorage.getItem("selectedCategory");
    if (!slug && id) {
      setGetDataTable(JSON.parse(oldLocalGetDataTable || "[]")?.[id]);
      setTableResult(tableResult);
      setSelectedCategory(JSON.parse(oldLocalSelectedCategory || "[]")?.[id]);
    }
  }, [id]);

  async function handleScripts() {
    const values = selectedCategory.map((item: any) => item.value);

    const df = getDataTable.map((row: any) => {
      let newRow = row.map((item: any) => item==null? "NA": item);
      newRow = newRow.map((item: any) =>
        typeof item === "number" ? parseFloat(item as any) : item
      );

      return zipObject(values, newRow);
    });

    try {
      const { data } = await fetchData<any>("/scripts/Task_manager", {
        method: "POST",
        body: {
          df: JSON.stringify(df),
          funcIDs: JSON.stringify(funcIdsValues[1] as any),
          current_outputs: JSON.stringify(outputVariables),
          current_prepost: firstInput.current_prepost,
          category: firstInput?.category,
        },
      });
      const renamedCols= await renameVariables(firstInput.current_prepost, firstInput.current_groups, firstInput.category, Object.keys(data[0]).slice(1,-2));
      setOutputColumns(renamedCols);
      setTableResult(data.map((el:any)=> zipObject( Object.keys(el).slice(1,-2), Object.values(el).slice(1,-2))));
      const invalidIDs=data.filter((el:any)=>el.invalid==1).map((el:any)=>el.ID);
    
      setInvalidRows(handleInvalidRows(invalidIDs,renamedCols.length, "invalid-cell"));
      // save in local storage for later use
      const oldLocalGetDataTable = localStorage.getItem("getDataTable");

      if (oldLocalGetDataTable) {
        const oldLocalData = JSON.parse(oldLocalGetDataTable);
        oldLocalData.push(getDataTable); // Add the new getDataTable to the array

        localStorage.setItem("getDataTable", JSON.stringify(oldLocalData)); // Store the updated array
      } else {
        localStorage.setItem(
          "getDataTable",
          JSON.stringify([getDataTable]) // Wrap the getDataTable in an array if it's not an array already
        );
      }

      const oldLocal = localStorage.getItem("tableResult");
      if (oldLocal) {
        const oldLocalData = JSON.parse(oldLocal);
        oldLocalData.push(data); // Add the new data to the array
        localStorage.setItem("tableResult", JSON.stringify(oldLocalData)); // Store the updated array
      } else {
        localStorage.setItem("tableResult", JSON.stringify([data])); // Wrap the data in an array if it's not an array already
      }

      const oldSelectedCategory = localStorage.getItem("selectedCategory");
      if (oldSelectedCategory) {
        const oldLocalData = JSON.parse(oldSelectedCategory);
        oldLocalData.push(selectedCategory); // Add the new data to the array
        localStorage.setItem("selectedCategory", JSON.stringify(oldLocalData)); // Store the updated array
      } else {
        localStorage.setItem(
          "selectedCategory",
          JSON.stringify([selectedCategory])
        ); // Wrap the data in an array if it's not an array already
      }
    } catch (e) {
      console.log(e);
    }
  }

  const autoComplete = selectedCategory.map(({ value }: { value: string }) => {
    const result = {
      type: sleetedUserIndex[value],
      strict: true,
      source: null,
    };
    if (sleetedUserIndex[value] === "autocomplete" && labData) {
      result.source = labData.map((el:any)=>el.label);
    }
    return result;
  });

  return (
    <>
    <div className="w-full  h-full pt-[170px]">
      <div className="pb-12 space-y-4 text-center">
        <div className="relative flex flex-col ">
          <Text variant="white" size="f2">
          <span className="relative mx-2">
          Customize <Line className="absolute -bottom-2" />
            </span>
             Your Conversion Table{" "}

            with
          </Text>
          <Text variant="white" size="f2">
            TreatMeta
          </Text>
        </div>
        <Text variant="default">
          where exploration meets innovation. Begin your quest for knowledge and
          discovery as we provide the tools
        </Text>
      </div>

      <div className="flex flex-col ">
        <div className="flex items-end w-full gap-7 ">
          {category.length < 1 && (
            <div className="grid items-end w-full grid-cols-12 gap-6">
              <div className="col-span-4">
                <Input
                  label="Current Groups"
                  name="current_groups"
                  max={10}
                  min={0}
                  value={+firstInput.current_groups}
                  type="number"
                  onChange={(e) => {
                    setFirstInput({
                      ...firstInput,
                      current_groups: e.target.value.toString(),
                    });
                  }}
                />
              </div>
              <div className="col-span-4">
                <Select
                  name="Category"
                  label="Category"
                  options={availableCategoriesData}
                  onChange={(e: any) => {
                    setFirstInput({
                      ...firstInput,
                      category: e.value.toString(),
                    });
                  }}
                  className="z-10 basic-multi-select"
                  classNamePrefix="select"
                  onBlur={() => setOpenSelect(false)}
                  onFocus={() => setOpenSelect(true)}
                  menuIsOpen={openSelect}
                />
              </div>

              <div className="flex col-span-3 gap-3">
                <Button onClick={handleFirstInput} className="w-full h-[54px]">
                  Next
                </Button>
                <Button
                  className="w-full h-[54px]"
                  onClick={() => {
                    setFirstInput({
                      current_prepost: "0",
                    });
                    setCategory([]);
                    setSelectedCategory([]);
                    setSelectTypes([]);
                    setInputParams([]);
                    setFuncIdsValues([]);
                    setOutputVariables(null);
                    setGetDataTable([]);
                    setTableResult([]);
                    router.push("/start");
                  }}
                  variant="ghost"
                >
                  Reset
                </Button>
              </div>
              <label
                htmlFor="current_prepost"
                className="flex items-center col-span-12 gap-3 text-base font-medium text-white cursor-pointer w-fit"
                data-tooltip-id="prepost-tooltip" data-tooltip-content="Check this if your data is in a prepost format"
              >
                <Input
                  className="w-5 h-5 "
                  type="checkbox"
                  color="blue"
                  id="current_prepost"
                  name="current_prepost"
                  onChange={(e) => {
                    setFirstInput({
                      ...firstInput,
                      current_prepost: e ? "1" : "0",
                    });
                  }}
                />
                Current Prepost
              </label>
              <Tooltip id="prepost-tooltip" />
            </div>
          )}
          {category.length !== 0 && !outputVariables && (
            <div className="flex items-end w-full gap-6">
              <div className="flex-1">
                <Select
                  label="Variables"
                  isMulti
                  name="colors"
                  value={selectedCategory}
                  // filter if add in selectedCategory
                  options={category.filter(
                    (item) => !selectedCategory.includes(item)
                  )}
                  onChange={(e: any) => {
                    setSelectedCategory(e as any);
                  }}
                  className="basic-multi-select w-[400px] z-10"
                  classNamePrefix="select"
                  onBlur={() => setOpenSelect(false)}
                  onFocus={() => setOpenSelect(true)}
                  menuIsOpen={openSelect}
                />
              </div>

              <div className="flex gap-6 w-[35%]">
                <Button
                  className="w-full h-[54px]"
                  onClick={() => {
                    handleFunc_IDs();
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
        {outputVariables && (
          <div className="mt-10 space-y-6">
            <div className="flex justify-between">
              <Text size="tee" variant="white">
                Enter your data here
              </Text>
              <div className="flex">

              {tableResult.length < 1 && (
               <Button className="h-[54px] !px-10" onClick={handleScripts}>
                  Convert
                </Button>


              )}
              {
                (
                  <Button
                  className="h-[54px] mx-2"
                  onClick={() => {
                    setTableResult([]);
                  }}
                  variant="ghost"
                >
                  Reset
                </Button>
                )
              }
              
              </div>
            </div>
            <div className="w-full my-5 ">
              <HandsonTable
                selectedCategory={selectedCategory}
                setGetDataTable={setGetDataTable}
                autoComplete={autoComplete}
              />
            </div>
          </div>
        )}


        

          {tableResult.length >= 1 && (
            <div className="w-full my-5">
              <Text size="tee" variant="white" className="my-6">
                    Results
                  </Text>
            
            <HotTable
              colHeaders= {outputColumns}
              data={tableResult.map((row: any) => {
                return keys(row).map((key) =>
                  row[key] === "NA" ? "" : row[key]
                );
              })}
              columnSorting={{
                headerAction: true,
                sortEmptyCells: false,
                indicator: true
              }}
              readOnly={true}
              autoColumnSize
              autoWrapCol={true}
              rowHeaders={true}
              cell={invalidRows}
              width="100%"
              height="auto"
              manualColumnResize={true}
              autoWrapRow={true}
              licenseKey="non-commercial-and-evaluation"
            />
             </div>
          )}
       
      </div>
      
    </div>
    <div className="h-[50vh] w-full" ></div>
    </>
  );
}
