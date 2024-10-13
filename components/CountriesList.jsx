"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/useGetUser";
import { useEffect, useState } from "react";

export const CountriesList = ({ user, alias }) => {
  const [countries, setCountries] = useState([]);
  const { isLoading, data } = useGetUser(user?.id);
  useEffect(() => {
    if (!isLoading) {
      if (typeof data.country !== "undefined")
        return setCountries(data.country);
    }
  }, [data, isLoading]);
  return (
    <div className="grid grid-cols-4 gap-4 m-auto max-w-[768px] justify-center items-center p-10">
      {isLoading ? (
        <>
          {Array.from(Array(26).keys()).map((key) => (
            <Skeleton key={key} className={`h-9 w-auto`} />
          ))}
        </>
      ) : (
        <>
          {countries.length === 0 ? (
            <span className="block text-3xl font-medium text-center uppercase col-span-4">
              No countries added
            </span>
          ) : (
            <>
              {countries.map((country) => (
                <Button key={country.iso} asChild>
                  <Link
                    href={`/${alias.toLowerCase()}/${country.iso}`}
                    className="font-normal text-[14px]"
                  >
                    {country.name}
                  </Link>
                </Button>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
