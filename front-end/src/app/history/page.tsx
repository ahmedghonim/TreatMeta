"use client";
import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { keys } from "lodash";
import { Text } from "@/components/ui/text";
import Empty from "@/components/view/history/empty";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function StartPAge() {
  const [tableResult, setTableResult] = useState<any>([]);
  const [outputColumns, setOutputColumns] = useState<any>([]);
  const [invalidRows, setInvalidRows] = useState<any>([]);
  const [getDataTable, setGetDataTable] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>([]);

  useEffect(() => {
    const tableResultStorage = localStorage.getItem("tableResult");
    const outputColumnsStorage = localStorage.getItem("outputColumns");
    const invalidRowsStorage = localStorage.getItem("invalidRows");
    const getDataTableStorage = localStorage.getItem("getDataTable");
    const getSelectedCategory = localStorage.getItem("selectedCategory");
    if (getDataTableStorage) {
      setGetDataTable(JSON.parse(getDataTableStorage).reverse());
    }
    if (tableResultStorage) {
      setTableResult(JSON.parse(tableResultStorage).reverse());
    }
    if (outputColumnsStorage) {
      setOutputColumns(JSON.parse(outputColumnsStorage).reverse());
    }
    if (invalidRowsStorage) {
      setInvalidRows(JSON.parse(invalidRowsStorage).reverse());
    }
    if (getSelectedCategory) {
      setSelectedCategory(JSON.parse(getSelectedCategory).reverse());
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("tableResult");
    localStorage.removeItem("outputColumns");
    localStorage.removeItem("invalidRows");
    localStorage.removeItem("getDataTable");
    localStorage.removeItem("selectedCategory");
    window.location.reload();
  };
  if (tableResult[0]?.length === 0) {
    return <Empty />;
  }

  return (
    <div className="w-full mb-10 space-y-3">
      {tableResult.length !== 0 && (
        <div className="w-full pt-10 text-end">
          <Button onClick={clearHistory} className="me-auto">
            Clear History
          </Button>
        </div>
      )}
      <Accordion type="single" collapsible className="w-full">
        {getDataTable.map((data: any, index: any) => (
          <AccordionItem
            value={index + 1}
            key={index + 1}
            className="w-full relative"
          >
            <AccordionTrigger>
              <Text size="tee" variant="white" className="my-6 ">
                Conversion {index + 1}
              </Text>
            </AccordionTrigger>
            <AccordionContent>
              <div className="w-full relative flex flex-col">
                <HotTable
                  stretchH="all"
                  autoColumnSize
                  autoRowSize
                  key={index + "values"}
                  colHeaders={selectedCategory?.[index].map(
                    (el: any) => el.label
                  )}
                  data={data}
                  readOnly={true}
                  autoWrapCol={true}
                  rowHeaders={true}
                  width="100%"
                  height="auto"
                  manualColumnResize={true}
                  autoWrapRow={true}
                  licenseKey="non-commercial-and-evaluation"
                />
              </div>
              <div className="w-full">
                <Text size="tee" variant="white" className="my-6">
                  Results
                </Text>

                <HotTable
                  key={index + "result"}
                  colHeaders={outputColumns[index]}
                  data={tableResult[index].map((row: any) => {
                    return keys(row).map((key) =>
                      row[key] === "NA" ? "" : row[key]
                    );
                  })}
                  stretchH="all"
                  readOnly={true}
                  autoColumnSize
                  autoRowSize
                  autoWrapCol={true}
                  rowHeaders={true}
                  cell={invalidRows[index]}
                  width="100%"
                  height="auto"
                  manualColumnResize={true}
                  autoWrapRow={true}
                  licenseKey="non-commercial-and-evaluation"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default StartPAge;
