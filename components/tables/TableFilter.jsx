"use client";
import { Input } from "@/components/ui/input";

export const Filter = ({ column }) => {
  if (column.id === "price") {
    return <div className="h-9"></div>;
  }
  return (
    <Input
      type="text"
      value={column.getFilterValue() ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search ${column.id}...`}
      className="bg-white"
    />
  );
};
