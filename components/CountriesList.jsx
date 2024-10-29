"use client";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export const CountriesList = ({ isLoading, countries, alias }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 items-start overflow-hidden">
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
                  className="font-semibold text-xl flex items-end uppercase border border-neutral-200 group/country transition hover:border-neutral-400 rounded-xl p-4 h-32 relative"
                >
                  <div className="h-full flex flex-col justify-between">
                    <Image
                      src={`/static/lang/${country.iso}.png`}
                      alt={""}
                      width={36}
                      height={32}
                      className="rounded-md border border-neutral-200"
                    />
                    {country.name}
                  </div>
                  <ChevronRight className="absolute bottom-4 right-4 transition opacity-0 group-hover/country:opacity-100 -translate-x-2 group-hover/country:translate-x-2" />
                </Link>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
