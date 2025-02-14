"use client";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { useSession } from "next-auth/react";
import useGetPriceHistory from "@/hooks/useGetPriceHistory";
import { useEffect, useState } from "react";
import LoadingState from "@/app/loading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HistoryTable } from "@/components/tables/HistoryTable";
import { redirect } from "next/navigation";

export const History = () => {
  const session = useSession();
  const { data, isLoading } = useGetPriceHistory();
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (session.status !== "loading")
      if (session.data !== undefined)
        setCountry(session.data.user.country[0].name.toLowerCase());
  }, [session]);

  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.data === undefined) {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  return (
    <div className="p-4  border border-neutral-200 rounded-xl flex flex-col items-end gap-4">
      <div className="flex gap-2 items-center w-full justify-between">
        {isLoading ? (
          <Skeleton className="h-9 w-[254px]" />
        ) : country === "" ? (
          <Skeleton className="h-9 w-[254px]" />
        ) : (
          <HeaderSmall
            text="Price history - last 10 days"
            className="text-center text-sm font-normal block py-2 px-4 bg-neutral-100 text-black rounded-md"
          />
        )}
        {isLoading ? (
          <Skeleton className="h-9 w-60" />
        ) : country === "" ? (
          <Skeleton className="h-9 w-60" />
        ) : (
          <Select
            defaultValue={country}
            onValueChange={(value) => setCountry(value)}
          >
            <SelectTrigger className="bg-white w-60">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {session.data.user.country.map((item) => {
                  return (
                    <SelectItem key={item.id} value={item.name.toLowerCase()}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <HistoryTable data={data} country={country} />
      )}
    </div>
  );
};
