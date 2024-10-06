"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/useGetUser";

export const CountriesList = ({ user, alias }) => {
  const { isLoading, data } = useGetUser(user.id);
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
          {data.country.length === 0 ? (
            <span className="block text-3xl font-medium uppercase">
              No countries added
            </span>
          ) : (
            <>
              {data.country.map((country) => (
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
