"use client";
import { DataTable } from "@/components/tables/DataTable";
import useGetProducts from "@/hooks/useGetProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";

export const TableContainer = ({ country, alias, user }) => {
  const { data, isLoading } = useGetProducts(alias, country.iso, user);
  const [priceChanges, setPriceChanges] = useState({
    priceUp: 0,
    priceDown: 0,
  });
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      if (data.length === 0) return;
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
      return () => {};
    }
  }, [data, isLoading]);
  return (
    <div className="px-10 h-[calc(100dvh_-_116px)] overflow-clip">
      {isLoading ? (
        <div className="w-full h-[calc(100dvh_-_116px)] flex flex-col">
          <Skeleton className="w-full h-[calc(100dvh_-_116px_-_40px)]" />
          <div className="w-full py-4 h-[68px] flex justify-between">
            <Skeleton className="w-44 h-[36px]" />
            <Skeleton className="w-96 h-[36px]" />
          </div>
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="h-[calc(100dvh_-_116px_-_40px)] flex items-center justify-center bg-gray-100 rounded-lg">
              <HeaderSmall text="No products" />
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
