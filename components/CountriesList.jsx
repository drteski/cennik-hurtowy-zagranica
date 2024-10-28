"use client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const CountriesList = ({ isLoading, countries, alias }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 items-start overflow-hidden">
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
                <Link
                  key={country.iso}
                  href={`/${alias.toLowerCase()}/${country.iso}`}
                  className="font-medium text-normal text-center uppercase bg-neutral-900 text-white rounded-xl p-8 transition hover:bg-neutral-700"
                >
                  {country.name}
                </Link>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
