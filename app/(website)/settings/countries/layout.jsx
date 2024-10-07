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
    return <LoadingState />;
  }
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
          <Button asChild>
            <Link href="/settings/users">Users</Link>
          </Button>
          <Button className="bg-gray-500" asChild>
            <Link href="/settings/countries">Countries</Link>
          </Button>
        </div>
        <div className="w-full h-[calc(100dvh_-_116px_-_40px_-_36px)]">
          <div className="bg-gray-100 grid grid-cols-[300px_1fr] gap-4 rounded-lg mt-2 h-full p-4">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="grid grid-rows-[auto_1fr_auto] gap-4">
                <Input
                  onChange={handleSearch}
                  placeholder="Search"
                  className="bg-white"
                />
                <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100dvh_-_116px_-_80px_-_36px_-_32px_-_14px)]">
                  {countries.map((country) => {
                    return (
                      <Button
                        key={country.id}
                        asChild
                        className={`${currentCountry === country.id ? "bg-gray-500" : ""}`}
                      >
                        <Link
                          className="flex justify-between items-center"
                          href={`/settings/countries/${country.id}`}
                        >
                          {country.name}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
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
