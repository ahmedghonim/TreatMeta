"use client";
import React, { useEffect, useState } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { keys } from "lodash";
import { Text } from "@/components/ui/text";
import Empty from "@/components/view/history/empty";
import { Button } from "@/components/ui/button";

function StartPAge() {
  const [tableResult, setTableResult] = useState<any>([]);
  const [outputColumns, setOutputColumns] = useState<any>([]);
  const [invalidRows, setInvalidRows] = useState<any>([]);
  const [getDataTable, setGetDataTable] = useState<any>([]);

  useEffect(() => {
    const tableResultStorage = localStorage.getItem("tableResult");
    const outputColumnsStorage = localStorage.getItem("outputColumns");
    const invalidRowsStorage = localStorage.getItem("invalidRows");
    const getDataTableStorage = localStorage.getItem("getDataTable");
    if (getDataTableStorage) {
      setGetDataTable(JSON.parse(getDataTableStorage));
    }
    if (tableResultStorage) {
      setTableResult(JSON.parse(tableResultStorage));
    }
    if (outputColumnsStorage) {
      setOutputColumns(JSON.parse(outputColumnsStorage));
    }
    if (invalidRowsStorage) {
      setInvalidRows(JSON.parse(invalidRowsStorage));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("tableResult");
    localStorage.removeItem("outputColumns");
    localStorage.removeItem("invalidRows");
    localStorage.removeItem("getDataTable");
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
      {getDataTable.map((data: any, index: any) => (
        <div key={index} className="w-full relative">
          <Text size="tee" variant="white" className="my-6 ">
            conversion {index + 1}
          </Text>
          <br />
          <div className="w-full relative">
            <HotTable
              key={index + "values"}
              colHeaders={outputColumns?.[index]}
              data={data}
              columnSorting={{
                headerAction: true,
                sortEmptyCells: false,
                indicator: true,
              }}
              readOnly={true}
              autoColumnSize
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
              columnSorting={{
                headerAction: true,
                sortEmptyCells: false,
                indicator: true,
              }}
              readOnly={true}
              autoColumnSize
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
          <hr className="bg-primary text-primary mt-10" />
        </div>
      ))}
    </div>
  );
}

export default StartPAge;
