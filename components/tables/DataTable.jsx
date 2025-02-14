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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CarbonChevronLeft,
  CarbonChevronRight,
  CarbonPageFirst,
  CarbonPageLast,
} from "@/components/Layout/Icones";
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
  const [showChanges, setShowChanges] = useState(false);
  const [productsData, setProductsData] = useState(() => products);
  const [sorting, setSorting] = useState([]);

  const columns = useTableColumns(country);

  useEffect(() => {
    if (showChanges) {
      return setProductsData((prevState) => {
        return prevState.filter((product) => product.price.difference !== 0);
      });
    }
    return setProductsData(products);
  }, [showChanges, products]);

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
        pageSize: 50,
        pageIndex: 0,
      },
    },
  });

  const textClasses = [
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-center text-[13px] truncate",
    "text-left text-[13px] truncate",
    "text-right text-[13px] truncate",
  ];

  return (
    <div className="h-full">
      <div className="h-[calc(100dvh_-_120px_-_68px_-_36px)] overflow-y-auto relative rounded-t-xl border-t border-l border-r border-neutral-200">
        <Table className="overflow-clip">
          <TableHeader className="bg-white after:border-b after:left-0 after:right-0 after:top-[85px] after:absolute after:h-[1px] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      className={`table-header-${index + 1} ${textClasses[index]} pt-2`}
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
      <div className="sticky bottom-0 p-2 rounded-b-xl border border-neutral-200 flex items-center justify-between">
        <div className="text-sm">
          Total products <strong>{table.getRowCount()}</strong> — Products with
          increased prices: <strong>{priceChanges.priceUp}</strong> — Products
          with decreased prices: <strong>{priceChanges.priceDown}</strong>
        </div>
        <Button
          className="py-0 h-5"
          variant="link"
          onClick={() => setShowChanges(!showChanges)}
        >
          {showChanges ? "Show all prices" : "Show price changes"}
        </Button>
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
              table.setPageIndex(currentPage);
            }}
            className="w-16"
          />
        </span>
        <Select
          value={table.getState().pagination.pageSize}
          onValueChange={(e) => {
            table.setPageSize(Number(e));
          }}
        >
          <SelectTrigger className="w-[125px]">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[50, 100, 200].map((pageSize) => (
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
