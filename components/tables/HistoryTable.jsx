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
  CarbonSubtract,
  CarbonTriangleDownSolid,
  CarbonTriangleSolid,
} from "@/components/Layout/Icones";
import { useEffect, useState } from "react";

export const HistoryTable = ({ data, country }) => {
  const [countryData, setCountryData] = useState([]);
  useEffect(() => {
    setCountryData(
      data
        .filter((item) => item.country.name.toLowerCase() === country)
        .map((product) => {
          return {
            ...product,
            product: {
              ...product.product,
              name: product.product.names.filter(
                (name) => name.lang === product.country.iso,
              )[0],
            },
          };
        }),
    );
  }, [data, country]);
  return (
    <div className="relative overflow-y-auto w-full h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px] text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countryData.map((product, index) => {
            const difference = product.oldPrice - product.newPrice;
            let priceElement;
            if (difference === 0) {
              priceElement = (
                <span className="font-medium text-xs flex justify-end items-center gap-1">
                  {new Intl.NumberFormat(product.country.locale, {
                    style: "currency",
                    currency: product.country.currency,
                  }).format(product.newPrice)}
                  <CarbonSubtract className="h-2.5 w-2.5" />
                </span>
              );
            }
            if (difference > 0) {
              priceElement = (
                <span className="price-down font-medium text-xs flex justify-end items-center gap-1">
                  {new Intl.NumberFormat(product.country.locale, {
                    style: "currency",
                    currency: product.country.currency,
                  }).format(product.newPrice)}
                  <CarbonTriangleDownSolid className="h-2.5 w-2.5" />
                </span>
              );
            }
            if (difference < 0) {
              priceElement = (
                <span className="price-up font-medium text-xs flex justify-end items-center gap-1">
                  {new Intl.NumberFormat(product.country.locale, {
                    style: "currency",
                    currency: product.country.currency,
                  }).format(product.newPrice)}
                  <CarbonTriangleSolid className="h-2.5 w-2.5" />
                </span>
              );
            }
            return (
              <TableRow key={index}>
                <TableCell className="text-xs">{product.product.id}</TableCell>
                <TableCell className="text-xs">{product.product.sku}</TableCell>
                <TableCell className="text-xs">
                  {product.product.name.name}
                </TableCell>
                <TableCell className="text-sm">{priceElement}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};