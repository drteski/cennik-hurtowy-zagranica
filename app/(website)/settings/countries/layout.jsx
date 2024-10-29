"use client";

import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { redirect, usePathname } from "next/navigation";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useGetCountries from "@/hooks/useGetCountries";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";

const SettingsCountriesLayout = ({ children }) => {
  const path = usePathname();
  const currentCountry = parseInt(path.replace("/settings/countries/", ""));
  const { data, isLoading } = useGetCountries();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      setCountries(data);
    }
  }, [data, isLoading]);

  const handleSearch = (e) => {
    setCountries(
      data.filter((country) =>
        country.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };

  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  if (session.data.user.role !== "admin") return redirect("/");
  return (
    <main className="h-screen grid grid-rows-[36px_1fr] p-10 min-w-[768px] gap-10">
      <NavigationBar
        backPath="/"
        user={session.data.user}
        showUser
        showLogout
      />
      <div className="flex flex-col">
        <div className="flex gap-2">
          <Link
            className="px-3 py-2 border border-neutral-200 text-neutral-400 rounded-md text-[14px] hover:border-neutral-400 transition"
            href="/settings/users"
          >
            Users
          </Link>
          <Link
            className="px-3 py-2 border border-neutral-500 rounded-md text-[14px] hover:border-neutral-400 transition"
            href="/settings/countries"
          >
            Countries
          </Link>
        </div>
        <div className="w-full h-[calc(100dvh_-_116px_-_40px_-_44px)]">
          <div className="grid grid-cols-[300px_1fr] gap-4 mt-2 h-full">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="grid grid-rows-[auto_1fr] gap-4 p-4 rounded-xl border border-neutral-200">
                <Input
                  onChange={handleSearch}
                  placeholder="Search"
                  className="bg-white"
                />
                <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100dvh_-_116px_-_80px_-_36px_-_32px_-_24px)]">
                  {countries.map((country) => {
                    return (
                      <Link
                        key={country.id}
                        className={`flex justify-between px-3 py-2 text-[14px] hover:border-neutral-400 transition border border-neutral-200 font-medium rounded-lg  items-center ${currentCountry === country.id ? "border-neutral-500" : ""}`}
                        href={`/settings/countries/${country.id}`}
                      >
                        {country.name}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsCountriesLayout;
