import { useRef } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { Store } from "react-notifications-component";
import { Button } from "./button";
import { attachHeaderTooltip } from "@/lib/columnTooltips";
import { Tooltip } from "react-tooltip";

const parseNum = (val: any): number | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  const str = String(val).trim();
  if (str === "" || str.toLowerCase() === "na" || str.toLowerCase() === "nan") return null;
  const cleanStr = str.replace(",", ".");
  const num = Number(cleanStr);
  return isNaN(num) ? null : num;
};

/**
 * Validate logical relationships between numeric statistics across changed rows.
 * If non-logical values are entered, triggers a toast notification and resets the value to blank.
 * Examples: (min < max), (q1 < q3), (lower < upper), (min <= median <= max), etc.
 */
const validateLogicalValues = (
  hot: any,
  changes: any[],
  selectedCategory: any[]
) => {
  if (!hot || !changes || !selectedCategory || selectedCategory.length === 0) return;

  const findCol = (predicate: (val: string, lbl: string) => boolean): number => {
    return selectedCategory.findIndex((item: any) => {
      if (!item) return false;
      const val = (typeof item === "string" ? item : item.value || "").toLowerCase().trim();
      const lbl = (typeof item === "string" ? item : item.label || "").toLowerCase().trim();
      return predicate(val, lbl);
    });
  };

  const getColLabel = (colIdx: number): string => {
    if (colIdx < 0 || !selectedCategory[colIdx]) return "";
    const item = selectedCategory[colIdx];
    return typeof item === "string" ? item : item.label || item.value || `Column ${colIdx + 1}`;
  };

  const colMin = findCol((v, l) => v === "min" || v.startsWith("min_") || l === "min" || l.startsWith("min ") || l.includes("minimum"));
  const colMax = findCol((v, l) => v === "max" || v.startsWith("max_") || l === "max" || l.startsWith("max ") || l.includes("maximum"));
  const colQ1 = findCol((v, l) => v === "q1" || l.includes("q1") || l.includes("25th") || l.includes("first quartile"));
  const colQ3 = findCol((v, l) => v === "q3" || l.includes("q3") || l.includes("75th") || l.includes("third quartile"));
  const colLower = findCol((v, l) => v === "llci" || v === "lower" || v === "ll" || l.includes("lower") || l.includes("llci"));
  const colUpper = findCol((v, l) => v === "ulci" || v === "upper" || v === "ul" || l.includes("upper") || l.includes("ulci"));
  const colMedian = findCol((v, l) => v === "median" || l.includes("median"));
  const colEvents = findCol((v, l) => v === "n_events" || v.includes("event") || l.includes("event"));
  const colTotal = findCol((v, l) => (v === "n" || l === "n" || v === "total" || l.includes("sample size")) && !v.includes("event") && !l.includes("event"));
  const colPval = findCol((v, l) => v === "pval" || v === "p_val" || v === "p-val" || l.includes("p-val") || l.includes("p value"));
  const colSD = findCol((v, l) => v === "sd" || l === "sd" || l.includes("standard deviation"));
  const colSE = findCol((v, l) => v === "se" || l === "se" || l.includes("standard error"));
  const colN = findCol((v, l) => (v === "n" || l === "n" || v === "n1" || v === "n2") && !v.includes("event") && !l.includes("event"));

  const checkedCols = [
    colMin, colMax, colQ1, colQ3, colLower, colUpper,
    colMedian, colEvents, colTotal, colPval, colSD, colSE, colN
  ].filter((colIdx) => colIdx >= 0);

  // If none of the logical columns exist in the current category, skip validation
  if (checkedCols.length === 0) return;

  const changedRowIndices = Array.from(new Set(changes.map(([row]) => row)));
  const allErrors: string[] = [];
  const cellKey = (r: number, c: number) => `${r}:${c}`;
  const cellsToBlankMap = new Map<string, [number, number, any]>();

  for (const row of changedRowIndices) {
    const rowData = hot.getDataAtRow(row);
    if (!rowData) continue;

    const changedColsInRow = new Set(
      changes
        .filter(([r]) => r === row)
        .map(([, prop]) => (typeof prop === "number" ? prop : (hot.propToCol ? hot.propToCol(prop) : Number(prop))))
    );

    const blankViolatingCols = (cols: number[]) => {
      const matchingChanged = cols.filter((c) => c >= 0 && changedColsInRow.has(c));
      const targetCols = matchingChanged.length > 0 ? matchingChanged : cols.filter((c) => c >= 0);
      targetCols.forEach((c) => {
        cellsToBlankMap.set(cellKey(row, c), [row, c, null]);
      });
    };

    // Check non-numeric entries in numeric columns that were changed
    checkedCols.forEach((colIdx) => {
      if (changedColsInRow.has(colIdx)) {
        const rawVal = rowData[colIdx];
        if (rawVal !== null && rawVal !== undefined) {
          const str = String(rawVal).trim();
          if (str !== "" && str.toLowerCase() !== "na" && str.toLowerCase() !== "nan") {
            const cleanStr = str.replace(",", ".");
            if (isNaN(Number(cleanStr))) {
              cellsToBlankMap.set(cellKey(row, colIdx), [row, colIdx, null]);
              allErrors.push(
                `Row ${row + 1}: Non-numeric value ("${str}") entered for ${getColLabel(colIdx)}. Value reset to blank.`
              );
            }
          }
        }
      }
    });

    const minVal = colMin >= 0 ? parseNum(rowData[colMin]) : null;
    const maxVal = colMax >= 0 ? parseNum(rowData[colMax]) : null;
    const q1Val = colQ1 >= 0 ? parseNum(rowData[colQ1]) : null;
    const q3Val = colQ3 >= 0 ? parseNum(rowData[colQ3]) : null;
    const lowerVal = colLower >= 0 ? parseNum(rowData[colLower]) : null;
    const upperVal = colUpper >= 0 ? parseNum(rowData[colUpper]) : null;
    const medianVal = colMedian >= 0 ? parseNum(rowData[colMedian]) : null;
    const eventsVal = colEvents >= 0 ? parseNum(rowData[colEvents]) : null;
    const totalVal = colTotal >= 0 ? parseNum(rowData[colTotal]) : null;
    const pvalVal = colPval >= 0 ? parseNum(rowData[colPval]) : null;
    const sdVal = colSD >= 0 ? parseNum(rowData[colSD]) : null;
    const seVal = colSE >= 0 ? parseNum(rowData[colSE]) : null;
    const nVal = colN >= 0 ? parseNum(rowData[colN]) : null;

    // 1. Min < Max
    if (minVal !== null && maxVal !== null && minVal >= maxVal) {
      allErrors.push(
        `Row ${row + 1}: Minimum (${minVal}) must be strictly less than Maximum (${maxVal}). Value reset to blank.`
      );
      blankViolatingCols([colMin, colMax]);
    }

    // 2. Q1 < Q3
    if (q1Val !== null && q3Val !== null && q1Val >= q3Val) {
      allErrors.push(
        `Row ${row + 1}: First quartile Q1 (${q1Val}) must be strictly less than Third quartile Q3 (${q3Val}). Value reset to blank.`
      );
      blankViolatingCols([colQ1, colQ3]);
    }

    // 3. Lower < Upper (e.g. llci < ulci)
    if (lowerVal !== null && upperVal !== null && lowerVal >= upperVal) {
      allErrors.push(
        `Row ${row + 1}: Lower limit (${lowerVal}) must be strictly less than Upper limit (${upperVal}). Value reset to blank.`
      );
      blankViolatingCols([colLower, colUpper]);
    }

    // 4. Median bounds
    if (medianVal !== null) {
      if (minVal !== null && medianVal < minVal) {
        allErrors.push(
          `Row ${row + 1}: Median (${medianVal}) cannot be less than Minimum (${minVal}). Value reset to blank.`
        );
        blankViolatingCols([colMedian, colMin]);
      }
      if (maxVal !== null && medianVal > maxVal) {
        allErrors.push(
          `Row ${row + 1}: Median (${medianVal}) cannot be greater than Maximum (${maxVal}). Value reset to blank.`
        );
        blankViolatingCols([colMedian, colMax]);
      }
      if (q1Val !== null && medianVal < q1Val) {
        allErrors.push(
          `Row ${row + 1}: Median (${medianVal}) cannot be less than Q1 (${q1Val}). Value reset to blank.`
        );
        blankViolatingCols([colMedian, colQ1]);
      }
      if (q3Val !== null && medianVal > q3Val) {
        allErrors.push(
          `Row ${row + 1}: Median (${medianVal}) cannot be greater than Q3 (${q3Val}). Value reset to blank.`
        );
        blankViolatingCols([colMedian, colQ3]);
      }
    }

    // 5. Min <= Q1 and Q3 <= Max
    if (minVal !== null && q1Val !== null && minVal > q1Val) {
      allErrors.push(
        `Row ${row + 1}: Minimum (${minVal}) cannot be greater than Q1 (${q1Val}). Value reset to blank.`
      );
      blankViolatingCols([colMin, colQ1]);
    }
    if (maxVal !== null && q3Val !== null && q3Val > maxVal) {
      allErrors.push(
        `Row ${row + 1}: Q3 (${q3Val}) cannot be greater than Maximum (${maxVal}). Value reset to blank.`
      );
      blankViolatingCols([colMax, colQ3]);
    }

    // 6. Events <= Total Sample Size
    if (eventsVal !== null && totalVal !== null && eventsVal > totalVal) {
      allErrors.push(
        `Row ${row + 1}: Events (${eventsVal}) cannot exceed Total sample size (${totalVal}). Value reset to blank.`
      );
      blankViolatingCols([colEvents, colTotal]);
    }

    // 7. P-value in [0, 1]
    if (pvalVal !== null && (pvalVal < 0 || pvalVal > 1)) {
      allErrors.push(
        `Row ${row + 1}: P-value (${pvalVal}) must be between 0 and 1. Value reset to blank.`
      );
      blankViolatingCols([colPval]);
    }

    // 8. Non-negative checks (SD, SE >= 0, N > 0)
    if (sdVal !== null && sdVal < 0) {
      allErrors.push(`Row ${row + 1}: Standard deviation (SD) cannot be negative. Value reset to blank.`);
      blankViolatingCols([colSD]);
    }
    if (seVal !== null && seVal < 0) {
      allErrors.push(`Row ${row + 1}: Standard error (SE) cannot be negative. Value reset to blank.`);
      blankViolatingCols([colSE]);
    }
    if (nVal !== null && nVal <= 0) {
      allErrors.push(`Row ${row + 1}: Sample size (N) must be greater than 0. Value reset to blank.`);
      blankViolatingCols([colN]);
    }
  }

  // If non-logical values were found, reset them to blank in Handsontable
  if (cellsToBlankMap.size > 0) {
    const cellsToBlank = Array.from(cellsToBlankMap.values());
    cellsToBlank.forEach(([r, c]) => {
      hot.removeCellMeta(r, c, "className");
    });
    hot.setDataAtCell(cellsToBlank, 'logicalValidation');
  }

  // Trigger toaster notification
  if (allErrors.length > 0) {
    Store.addNotification({
      title: "Invalid Logical Value",
      message:
        allErrors.slice(0, 3).join("\n") +
        (allErrors.length > 3 ? `\n...and ${allErrors.length - 3} more issue(s)` : ""),
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
      },
    });
  }
};

const MAX_ROWS = 10000;

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
        afterGetColHeader={(col, TH) => {
          attachHeaderTooltip(
            col,
            TH,
            selectedCategory.map((item: any) => item.label || item.value || item)
          );
        }}
        afterDocumentKeyDown={(e) => {
          if (hotRef.current) {
            const hot = hotRef.current?.hotInstance;
            if (e.key == "Insert") {
              if (hot.countRows() >= MAX_ROWS) {
                Store.addNotification({
                  title: "Row Limit Reached",
                  message: `Cannot add more rows. Table limit is ${MAX_ROWS.toLocaleString()} rows.`,
                  type: "warning",
                  insert: "top",
                  container: "top-right",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  dismiss: { duration: 5000, onScreen: true },
                });
                return;
              }
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
                  const currentRows = hot.countRows();
                  if (currentRows >= MAX_ROWS) {
                    Store.addNotification({
                      title: "Row Limit Reached",
                      message: `Cannot add more rows. Table limit is ${MAX_ROWS.toLocaleString()} rows.`,
                      type: "warning",
                      insert: "top",
                      container: "top-right",
                      animationIn: ["animate__animated", "animate__fadeIn"],
                      animationOut: ["animate__animated", "animate__fadeOut"],
                      dismiss: { duration: 5000, onScreen: true },
                    });
                    return;
                  }
                  const row = hot.getSelectedLast()[2];
                  const toAdd = Math.min(10, MAX_ROWS - currentRows);
                  hot.alter("insert_row_below", row, toAdd);
                }
              }

            },
            row_50_below: {
              name: "Add 50 rows below",
              callback(key, selection, clickEvent) {
                if (hotRef.current) {
                  const hot = hotRef.current?.hotInstance;
                  const currentRows = hot.countRows();
                  if (currentRows >= MAX_ROWS) {
                    Store.addNotification({
                      title: "Row Limit Reached",
                      message: `Cannot add more rows. Table limit is ${MAX_ROWS.toLocaleString()} rows.`,
                      type: "warning",
                      insert: "top",
                      container: "top-right",
                      animationIn: ["animate__animated", "animate__fadeIn"],
                      animationOut: ["animate__animated", "animate__fadeOut"],
                      dismiss: { duration: 5000, onScreen: true },
                    });
                    return;
                  }
                  const row = hot.getSelectedLast()[2];
                  const toAdd = Math.min(50, MAX_ROWS - currentRows);
                  hot.alter("insert_row_below", row, toAdd);
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

            // Handle state update when non-logical cells were reset to blank
            if ((source as any) === 'logicalValidation') {
              let changedData = hot.getData();
              if (changedData.length > MAX_ROWS) {
                changedData = changedData.slice(0, MAX_ROWS);
              }
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
              return;
            }

            // Truncate rows after MAX_ROWS (10,000) to avoid overloading the server
            const totalRows = hot.countRows();
            let effectiveChanges = changes;

            if (totalRows > MAX_ROWS) {
              const excess = totalRows - MAX_ROWS;
              hot.alter("remove_row", MAX_ROWS, excess);
              effectiveChanges = changes.filter(([r]: any) => r < MAX_ROWS);

              Store.addNotification({
                title: "Rows Truncated",
                message: `Table exceeded maximum limit of ${MAX_ROWS.toLocaleString()} rows. Rows after 10,000 have been truncated to prevent server overload.`,
                type: "warning",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 6000,
                  onScreen: true,
                  pauseOnHover: true,
                },
              });
            }

            let changedData = hot.getData();
            if (changedData.length > MAX_ROWS) {
              changedData = changedData.slice(0, MAX_ROWS);
            }

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

            // Check logical value constraints (min < max, q1 < q3, lower < upper, etc.)
            validateLogicalValues(hot, effectiveChanges, selectedCategory);
          }
        }}
      />
      <div className="mt-4">
        <Button className="mr-2"
          variant={"ghost"}
          onClick={() => {
            if (hotRef.current) {
              const hot = hotRef.current?.hotInstance;
              if (hot.countRows() >= MAX_ROWS) {
                Store.addNotification({
                  title: "Row Limit Reached",
                  message: `Cannot add more rows. Table limit is ${MAX_ROWS.toLocaleString()} rows.`,
                  type: "warning",
                  insert: "top",
                  container: "top-right",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  dismiss: { duration: 5000, onScreen: true },
                });
                return;
              }
              const row = hot.countRenderedRows();

              hot.alter("insert_row_below", row, 1)
            }
          }}
        >Add Row</Button>
        <Button variant={"ghost"}
          onClick={() => {
            if (hotRef.current) {
              const hot = hotRef.current?.hotInstance;
              const currentRows = hot.countRows();
              if (currentRows >= MAX_ROWS) {
                Store.addNotification({
                  title: "Row Limit Reached",
                  message: `Cannot add more rows. Table limit is ${MAX_ROWS.toLocaleString()} rows.`,
                  type: "warning",
                  insert: "top",
                  container: "top-right",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  dismiss: { duration: 5000, onScreen: true },
                });
                return;
              }
              const row = hot.countRenderedRows();
              const toAdd = Math.min(10, MAX_ROWS - currentRows);
              hot.alter("insert_row_below", row, toAdd)
            }
          }}
        >Add 10 Rows</Button>
      </div>
      <Tooltip id="col-header-tooltip" className="!z-[9999] max-w-sm text-xs shadow-xl" />
    </div>
  );
};

export default HandsonTable;
