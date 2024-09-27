"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CarbonChevronLeft,
  CarbonChevronRight,
  CarbonPageFirst,
  CarbonPageLast,
} from "@/components/Icones";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableColumns } from "@/hooks/useTableColumns";
import { Filter } from "@/components/tables/TableFilter";

export const DataTable = ({ products, country, priceChanges }) => {
  const [productsData, setProductsData] = useState(() => products);
  const [sorting, setSorting] = useState([]);

  const columns = useTableColumns(country);

  const table = useReactTable({
    data: productsData,
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
    },
  });

  const headerWidthClasses = [10, 10, 10, 10, 50, 10];
  const textClasses = [
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-left text-[13px] truncate",
    "text-right text-[13px] truncate",
  ];

  return (
    <div className="h-full">
      <div className="h-[calc(100dvh_-_120px_-_68px_-_36px)] overflow-y-auto relative">
        <Table className="overflow-clip rounded-lg">
          <TableHeader className="sticky top-0 bg-gray-100 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      className={`w-[${headerWidthClasses[index]}%] ${textClasses[index]} pt-2`}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {header.column.getCanFilter() ? (
                            <div className="mb-2">
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <TableCell
                        key={cell.id}
                        className={`${textClasses[index]}`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="bg-gray-100 sticky bottom-0 p-2 rounded-b-md text-sm">
        Total products <strong>{table.getRowCount()}</strong> — Products with
        increased prices: <strong>{priceChanges.priceUp}</strong> — Products
        with decreased prices: <strong>{priceChanges.priceDown}</strong>
      </div>
      <div className="grid grid-cols-[150px_1fr_auto_auto] items-center gap-8 py-4">
        <span className="flex items-center  gap-1 w-[150px]">
          <div>Page</div>
          <strong>{table.getState().pagination.pageIndex + 1}</strong> /{" "}
          <strong>{table.getPageCount()}</strong>
        </span>
        <span className="flex items-center justify-self-end gap-1">
          Go to:
          <Input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const currentPage = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              router.push(`${pathname}?page=${currentPage + 1}&limit=${limit}`);
              table.setPageIndex(currentPage);
            }}
            className="w-16"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize}
          onValueChange={(e) => {
            table.setPageSize(Number(e));
            router.push(`${pathname}?page=${page}&limit=${e}`);
          }}
        >
          <SelectTrigger className="w-[125px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[25, 50, 100, 200].map((pageSize) => (
                <SelectItem value={pageSize} key={pageSize}>
                  Pokaż {pageSize}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            size="icon"
            className=""
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <CarbonPageFirst />
          </Button>
          <Button
            size="icon"
            className=""
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <CarbonChevronLeft />
          </Button>
          <Button
            size="icon"
            className=""
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <CarbonChevronRight />
          </Button>
          <Button
            size="icon"
            className=""
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <CarbonPageLast />
          </Button>
        </div>
      </div>
    </div>
  );
};
