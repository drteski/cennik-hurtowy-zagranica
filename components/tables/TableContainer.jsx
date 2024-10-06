"use client";
import { DataTable } from "@/components/tables/DataTable";
import useGetProducts from "@/hooks/useGetProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export const TableContainer = ({ country, alias, user }) => {
  const { data, isLoading } = useGetProducts(alias, country.iso, user);
  const [priceChanges, setPriceChanges] = useState({
    priceUp: 0,
    priceDown: 0,
  });
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      const productsWithDifferences = data.filter(
        (product) => product.price.difference !== 0,
      );
      const productsWithoutDifferences = data.filter(
        (product) => product.price.difference === 0,
      );
      const priceChanges = productsWithDifferences.reduce(
        (previousValue, currentValue) => {
          if (currentValue.price.difference > 0) previousValue.priceDown++;
          if (currentValue.price.difference < 0) previousValue.priceUp++;
          return previousValue;
        },
        {
          priceUp: 0,
          priceDown: 0,
        },
      );
      setPriceChanges(priceChanges);
      setProducts([...productsWithDifferences, ...productsWithoutDifferences]);
    }
  }, [data, isLoading]);
  return (
    <div className="px-4 h-[calc(100dvh_-_120px)] overflow-clip">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <>
          {products.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <span className="block text-2xl uppercase font-medium">
                No product data
              </span>
            </div>
          ) : (
            <>
              <DataTable
                products={products}
                priceChanges={priceChanges}
                country={country}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
