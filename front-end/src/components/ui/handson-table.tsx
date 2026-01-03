import { useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { Button } from "./button";

// register Handsontable's modules

/**
 * A strongly typed Table component that uses Handsontable library.
 *
 * @param {Object} props - The props object.
 * @param {React.Dispatch<React.SetStateAction<any[]>>} props.setGetDataTable - The function to set the getDataTable state.
 * @param {CategoryType[]} props.selectedCategory - The selected category.
 * @param {any[]} props.getDataTable - The getDataTable.
 * @param {CategoryType[]} props.autoComplete - The autoComplete.
 * @return {React.ReactElement} The Table component.
 */
const HandsonTable = ({
  setGetDataTable,
  selectedCategory,
  getDataTable,
  autoComplete,
}: {
  setGetDataTable: any;
  selectedCategory: any;
  getDataTable?: any[];
  autoComplete: any[];
}): React.ReactElement => {
  registerAllModules();
  const hotRef = useRef<any>(null);

  return (
    <div>
      <HotTable
        data={getDataTable && getDataTable.length > 0 ? getDataTable : undefined}
        autoColumnSize
        autoRowSize
        colHeaders={selectedCategory.map((item: any) => item.label)}
        ref={hotRef}
        startRows={10}
        allowInsertRow={true}
        allowInsertColumn={false}
        allowRemoveColumn={false}
        columnSorting={{
          headerAction: true,
          sortEmptyCells: false,
          indicator: true
        }}
        columns={autoComplete}
        allowInvalid={false}
        width="100%"
        startCols={selectedCategory.map((item: any) => item.label).length}
        autoWrapCol={true}
        rowHeaders={true}
        height="auto"
        manualColumnResize={true}
        autoWrapRow={true}
        licenseKey="non-commercial-and-evaluation"
        afterDocumentKeyDown={(e) => {
          if (hotRef.current) {
            const hot = hotRef.current?.hotInstance;
            if (e.key == "Insert") {

              const row = hot.getSelectedLast()[2];
              hot.alter("insert_row_below", row, 1)
            }
          }
        }}
        contextMenu={{
          callback(key, selection, clickEvent) {
            // Common callback for all options
            console.log(key, selection, clickEvent);
          },
          items: {
            row_above: {
              name: "Add row above"
            },
            row_below: {
              name: "Add row below"
            },
            row_10_below: {
              name: "Add 10 rows below",
              callback(key, selection, clickEvent) {
                if (hotRef.current) {
                  const hot = hotRef.current?.hotInstance;
                  const row = hot.getSelectedLast()[2];
                  hot.alter("insert_row_below", row, 10)
                }
              }

            },
            row_50_below: {
              name: "Add 50 rows below",
              callback(key, selection, clickEvent) {
                if (hotRef.current) {
                  const hot = hotRef.current?.hotInstance;
                  const row = hot.getSelectedLast()[2];
                  hot.alter("insert_row_below", row, 50)
                }
              }

            },
            remove_row: {
              name: "Remove row"
            },
            sp1: { name: '---------' },
            undo: {
              name: "Undo"
            },
            redo: {
              name: "Redo"
            },
            copy: {
              name: "Copy"
            },
            cut: {
              name: "Cut"
            },
            paste: {
              name: "Paste"
            }


          }

        }}
        afterChange={(changes, source) => {
          // Only update state for user-initiated changes, not when data is loaded from props
          if (!changes || source === 'loadData') return;

          if (hotRef.current) {
            const hot = hotRef.current?.hotInstance;
            let changedData = hot.getData();
            const colAutoComplete = autoComplete.findIndex(el => el.type === "autocomplete");

            if (colAutoComplete != -1) {
              const localLabs = autoComplete[colAutoComplete].source;
              changedData = changedData.map((row: any) => {

                const labIndex = localLabs.findIndex((el: any) => el == row[colAutoComplete]);
                row[colAutoComplete] = labIndex == -1 ? null : labIndex + 1; //Index starts at 1 not 0
                return row;

              });
            }
            setGetDataTable(changedData);
          }
        }}
      />
      <div className="mt-4">
        <Button className="mr-2"
          variant={"ghost"}
          onClick={() => {
            if (hotRef.current) {
              const hot = hotRef.current?.hotInstance;
              const row = hot.countRenderedRows();

              hot.alter("insert_row_below", row, 1)
            }
          }}
        >Add Row</Button>
        <Button variant={"ghost"}
          onClick={() => {
            if (hotRef.current) {
              const hot = hotRef.current?.hotInstance;
              const row = hot.countRenderedRows();

              hot.alter("insert_row_below", row, 10)
            }
          }}
        >Add 10 Rows</Button>
      </div>
    </div>
  );
};

export default HandsonTable;
