import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  CarbonSubtract,
  CarbonTriangleDownSolid,
  CarbonTriangleSolid,
} from "@/components/Icones";

export const useTableColumns = (country) => {
  return useMemo(
    () => [
      {
        accessorKey: "id",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">ID</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sku",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">SKU</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ean",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">EAN</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "brand",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">BRAND</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "name",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">NAME</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "price",
        header: (props) => (
          <div className="w-full">
            <Button
              variant="ghost"
              className="h-8 hover:bg-transparent p-0"
              onClick={() =>
                props.column.toggleSorting(props.column.getIsSorted() === "asc")
              }
            >
              <span className="block text-xs">Price</span>
              <CaretSortIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ),
        cell: (info) => {
          const { newPrice, currency, difference } = info.getValue();
          const price = new Intl.NumberFormat(country.locale, {
            style: "currency",
            currency: country.currency,
          }).format(newPrice);
          if (difference === 0) {
            return (
              <span className="font-medium text-[16px] flex justify-end items-center gap-2">
                {price}
                <CarbonSubtract className="h-3 w-3" />
              </span>
            );
          }
          if (difference > 0) {
            return (
              <span className="text-green-600 font-medium text-[16px] flex justify-end items-center gap-2">
                {price}
                <CarbonTriangleDownSolid className="h-3 w-3" />
              </span>
            );
          }
          if (difference < 0) {
            return (
              <span className="text-red-600 font-medium text-[16px] flex justify-end items-center gap-2">
                {price}
                <CarbonTriangleSolid className="h-3 w-3" />
              </span>
            );
          }
        },
        footer: (props) => props.column.id,
        sortingFn: (rowA, rowB, columnId) => {
          if (typeof rowA.getValue(columnId).value === "string") {
            return rowA.getValue(columnId).value < rowB.getValue(columnId).value
              ? 1
              : -1;
          } else {
            return rowA.getValue(columnId).newPrice <
              rowB.getValue(columnId).newPrice
              ? 1
              : -1;
          }
        },
      },
    ],
    [],
  );
};
