"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { set } from "mongoose";
import React from "react";

export interface ColumnData<TData> {
  key: keyof TData;
  title: string;
  sort?: boolean;
  canSearch?: boolean;
  sortFunction?: (a: TData, b: TData) => number;
  render: ({
    value,
    record,
  }: {
    value: string;
    record: TData;
  }) => React.ReactNode;
}
type Props<TData> = {
  search?: {
    enabled: boolean;
    placeholder?: string;
  };
  data: TData[];
  columns: ColumnData<TData>[];
};

function Table<TData>(props: Props<TData>) {
  // chunk the data into pages
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState<number>(50);
  const [pages, setPages] = React.useState<number>(
    Math.ceil(props.data.length / pageSize)
  );
  const [start, end] = [page * pageSize, (page + 1) * pageSize];
  const [allData, setAllData] = React.useState<TData[]>(props.data);
  const [data, setData] = React.useState<TData[]>(allData.slice(start, end));
  const [sortBy, setSortBy] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState<string>("");

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setData(
      allData.filter((d: any) => {
        return Object.values(d).some((v: any) =>
          v.toString().toLowerCase().includes(e.target.value.toLowerCase())
        );
      })
    );
    setPage(0);
    setPages(Math.ceil(data.length / pageSize));
  };

  React.useEffect(() => {
    setAllData(props.data);
    setData(allData.slice(start, end));
    setPages(Math.ceil(data.length / pageSize));
  }, [page, pageSize, props.data, allData]);

  if (allData.length === 0) {
    return <div className="text-neutral-500">No data to display</div>;
  }

  return (
    <div>
      {props.search?.enabled && (
        <div className="flex flex-row gap-4 items-center py-2 w-full">
          <input
            placeholder={props.search.placeholder || "Search..."}
            onChange={onSearch}
            value={search}
            className="w-[600px] flex text-start bg-neutral-800 rounded-md px-4 py-2 focus:outline-none ring-brand focus-visible:ring-2 transition-[box-shadow]"
          />
        </div>
      )}
      <div className=" p-4 rounded-md bg-neutral-800">
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${props.columns.length}, auto)`,
          }}
        >
          {props.columns.map((column) => (
            <div
              key={column.key as string}
              className="flex flex-row gap-2 items-center"
            >
              <div
                key={column.key as string}
                className={cn(
                  "text-brand text-xl font-bold ",
                  column.sort && "cursor-pointer"
                )}
                onClick={() => {
                  if (!column.sort) return;
                  if (column.sortFunction) {
                    setData([...data].sort(column.sortFunction));
                    return;
                  }
                  if (sortBy === column.key) {
                    setData([...data].reverse());
                  } else {
                    setData(
                      [...data].sort((a, b) => {
                        // check type of value
                        const aValue = a[column.key as keyof TData];
                        const bValue = b[column.key as keyof TData];

                        if (typeof aValue === "string") {
                          return aValue.localeCompare(bValue as string);
                        } else if (typeof aValue === "number") {
                          return aValue - (bValue as number);
                        } else {
                          return 0;
                        }
                      })
                    );
                  }
                  setSortBy(column.key as string);
                }}
              >
                {column.title}
              </div>
            </div>
          ))}

          {data.map((row, i) => (
            <React.Fragment key={i}>
              {props.columns.map((column) => (
                <div
                  key={column.key as string}
                  className="text-neutral-100 text-sm font-medium border-2 border-neutral-500 p-2 flex flex-row gap-2 items-center text-wrap"
                >
                  {column.render({
                    value: (
                      row[column.key as keyof TData] as any
                    )?.toString() as string,
                    record: row,
                  })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="w-full h-[2px] bg-neutral-500 my-4"></div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-4">
            {page > 0 ? (
              <Button
                onClick={() => {
                  setPage((prev) => prev - 1);
                  setData(data.slice(start - pageSize, start));
                }}
              >
                Previous
              </Button>
            ) : (
              <Button disabled>Previous</Button>
            )}

            {end < allData.length ? (
              <Button
                onClick={() => {
                  setPage((prev) => prev + 1);
                  setData(data.slice(end, end + pageSize));
                }}
              >
                Next
              </Button>
            ) : (
              <Button disabled>Next</Button>
            )}
          </div>
          <div className="flex flex-row gap-8 items-center">
            <span className="text-neutral-500">
              Showing {start + 1} to{" "}
              {end > allData.length ? allData.length : end} of {allData.length}
            </span>
            <span className="text-neutral-500">
              Page {page + 1} of {pages}
            </span>
            <div className="flex flex-row gap-2 items-center">
              <span className="text-neutral-300">Rows per page:</span>

              <select
                className="border-2 border-neutral-500 rounded-md p-2 bg-neutral-800 cursor-pointer"
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPages(
                    Math.ceil(props.data.length / parseInt(e.target.value))
                  );
                  setPage(0);
                  setData(props.data.slice(0, parseInt(e.target.value)));
                }}
                value={pageSize}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;

/**
 * {column.render({
                      value: (
                        row[column.key as keyof TData] as any
                      )?.toString() as string,
                      record: row,
                    })}
 */
