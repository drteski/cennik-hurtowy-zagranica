"use client";
import Link from "next/link";
import { Logo } from "@/components/Layout/Logos";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { Button } from "@/components/ui/button";
import { CarbonSettings, PodlasiakLogo } from "@/components/Layout/Icones";
import { useMemo } from "react";
import useGetUsers from "@/hooks/useGetUsers";
import { redirect } from "next/navigation";

import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { PricesChart } from "@/components/charts/PricesChart";

const BasePage = () => {
  const session = useSession();
  const { data, isLoading } = useGetUsers();

  const user = useMemo(() => {
    if (!isLoading) {
      if (session.data !== undefined)
        return data.filter((user) => user.id === session.data.user.id)[0];
      return {};
    }
    return {};
  }, [data, isLoading, session.data?.user.id, session.data, session.status]);

  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.data === undefined) {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  return (
    <main className="h-screen grid grid-rows-[36px_1fr_36px] min-w-[768px] p-10">
      <NavigationBar
        user={user}
        loadingState={isLoading}
        backPath={""}
        showUser
        showLogout
      />

      <div className="grid py-10 grid-cols-[300px_1fr] gap-4">
        <div className="flex flex-col gap-4 rounded-2xl bg-gray-100 p-4">
          <HeaderSmall text="Price lists" className="py-4" />
          <div className=" flex flex-col gap-4 justify-between h-full">
            <Link
              href="/rea"
              className="bg-gray-50 flex items-center justify-center p-16 h-full rounded-xl transition hover:bg-gray-200"
            >
              <Logo alias="Rea" />
            </Link>
            <Link
              href="/toolight"
              className="bg-gray-50 flex items-center justify-center p-16 h-full rounded-xl transition hover:bg-gray-200"
            >
              <Logo alias="Toolight" />
            </Link>
            <Link
              href="/tutumi"
              className="bg-gray-50 flex items-center justify-center p-16 h-full rounded-xl transition hover:bg-gray-200"
            >
              <Logo alias="Tutumi" />
            </Link>
          </div>
        </div>
        <div className="grid grid-rows-[100px_1fr]">
          <div className="grid grid-rows-2 gap-4 h-[calc(100dvh_-_72px_-_160px)]">
            <div className="p-4 bg-gray-100 rounded-2xl flex flex-col gap-4">
              <HeaderSmall
                text="Price history - last 10 days"
                className="text-left text-xl"
              />
            </div>
            <div className="p-4 bg-gray-100 rounded-2xl flex flex-col gap-4">
              <HeaderSmall
                text="Price changes - last 10 days"
                className="text-left text-xl"
              />
              <PricesChart />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end items-center">
        {user.role === "admin" ? (
          <Button size="icon" asChild>
            <Link href="/settings">
              <CarbonSettings className="h-5 w-5" />
            </Link>
          </Button>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
};

export default BasePage;
