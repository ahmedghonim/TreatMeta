"use client";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@/svg/delete";

function ResearchHistory() {
  function deleteHandler(id: number) {}
  const [localCategoryResult, setLocalCategoryResult] = useState<any>([]);
  const [localDataResult, setLocalDataResult] = useState<any>([]);
  const [localSelectedCategory, setLocalSelectedCategory] = useState<any>([]);

  useEffect(() => {
    const oldLocalGetDataTable = localStorage.getItem("getDataTable");
    const oldLocalData = localStorage.getItem("tableResult");
    const oldLocalSelectedCategory = localStorage.getItem("selectedCategory");
    if (oldLocalGetDataTable) {
      setLocalCategoryResult(JSON.parse(oldLocalGetDataTable));
    }
    if (oldLocalData) {
      setLocalDataResult(JSON.parse(oldLocalData));
    }
    if (oldLocalSelectedCategory) {
      setLocalSelectedCategory(JSON.parse(oldLocalSelectedCategory));
    }
  }, []);
  function handelDelete(id: number) {
    const oldLocalGetDataTable = localStorage.getItem("getDataTable");
    const oldLocalData = localStorage.getItem("tableResult");
    const oldLocalSelectedCategory = localStorage.getItem("selectedCategory");

    if (oldLocalGetDataTable) {
      const data = JSON.parse(oldLocalGetDataTable);
      data.splice(id, 1); // Add the new getDataTable to the array
      localStorage.setItem("getDataTable", JSON.stringify(data));
    }
    if (oldLocalData) {
      const data = JSON.parse(oldLocalData);
      data.splice(id, 1); // Add the new getDataTable to the array
      localStorage.setItem("tableResult", JSON.stringify(data));
    }
    if (oldLocalSelectedCategory) {
      const data = JSON.parse(oldLocalSelectedCategory);
      data.splice(id, 1); // Add the new getDataTable to the array
      localStorage.setItem("selectedCategory", JSON.stringify(data));
    }
  }
  return (
    <div className="w-full h-full space-y-6 pt-[220px]">
      <span className="flex items-center gap-4">
        <Text size="tef">Conversions History</Text>
        <Text size="tef" variant="primary">
          ({localCategoryResult.length})
        </Text>
      </span>
      <div className="space-y-4 ">
        {localCategoryResult.map((_: any, index: number) => (
          <SingleConversion
            key={index}
            localSelectedCategory={localSelectedCategory[index]}
            id={index}
            tableResult={localDataResult[index]}
            handelDelete={handelDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface SingleConversionProps {
  tableResult: any[];
  id: number;
  handelDelete: (id: number) => void;
  localSelectedCategory: any;
}

const SingleConversion = ({
  tableResult,
  id,
  handelDelete,
}: SingleConversionProps) => {
  return (
    <>
      <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 px-8 py-4 rounded bg-secondary/20">
        <div className="flex flex-col items-start">
          <Text variant="white" className="text-lg font-bold flex gap-2">
            {tableResult?.map(
              (para, index) =>
                index === 0 &&
                Object.keys(para).map((item, i) => <span key={i}>{item}</span>)
            )}
          </Text>

          {/* <Text size="base">{}</Text> */}
        </div>
        <div className="flex items-center gap-4 md:w-fit w-full">
          <Link className="w-full md:w-fit" href={`/history/${id}`}>
            <Button className="w-full md:w-fit">Retrieve Table</Button>
          </Link>
          <Button size="icon" variant="link" onClick={() => handelDelete(id)}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
    </>
  );
};

function Item({
  title,
  date,
  id,
  onClick,
}: {
  title: string;
  date: string;
  id: number;
  onClick: () => void;
}) {
  return (
    <div className="flex md:flex-row flex-col md:items-center justify-between gap-4 px-8 py-4 rounded bg-secondary/20">
      <div className="flex flex-col items-start">
        <Text variant="white" className="text-lg font-bold">
          {title}
        </Text>
        <Text size="base">{date}</Text>
      </div>
      <div className="flex items-center gap-4 md:w-fit w-full">
        <Link className="w-full md:w-fit" href={`/history/${id}`}>
          <Button className="w-full md:w-fit">View Research</Button>
        </Link>
        <Button size="icon" variant="link" onClick={onClick}>
          <DeleteIcon />
        </Button>
      </div>
    </div>
  );
}

export default ResearchHistory;
