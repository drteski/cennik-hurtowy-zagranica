"use client";

import Link from "next/link";
import { Logo } from "@/components/Layout/Logos";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { Button } from "@/components/ui/button";
import { CarbonSettings } from "@/components/Layout/Icones";
import useGetUsers from "@/hooks/useGetUsers";
import { redirect } from "next/navigation";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { History } from "@/components/tables/History";
import { useGetSessionUser } from "@/hooks/useGetSessionUser";

const BasePage = () => {
  const session = useSession();

  // const { data, isLoading } = useGetUsers();
  //
  // const user = useGetSessionUser(isLoading, data, session);

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
        user={session.data.user}
        // loadingState={isLoading}
        backPath={""}
        showUser
        showLogout
      />

      <div className="grid py-10 grid-cols-[400px_1fr] gap-4">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4">
          <HeaderSmall
            text="Price lists"
            className="text-center text-lg font-normal block py-2 px-4 bg-neutral-100 text-black rounded-md"
          />
          <div className=" flex flex-col gap-4 justify-between h-full">
            <Link
              href="/rea"
              className="border border-neutral-200 flex items-center justify-center p-16 h-full rounded-lg transition hover:border-neutral-400"
            >
              <Logo alias="Rea" />
            </Link>
            <Link
              href="/toolight"
              className="border border-neutral-200 flex items-center justify-center p-16 h-full rounded-lg transition hover:border-neutral-400"
            >
              <Logo alias="Toolight" />
            </Link>
            <Link
              href="/tutumi"
              className="border border-neutral-200 flex items-center justify-center p-16 h-full rounded-lg transition hover:border-neutral-400"
            >
              <Logo alias="Tutumi" />
            </Link>
          </div>
        </div>
        <div className="grid grid-rows-[100px_1fr]">
          <div className="grid grid-rows-1 gap-4 h-[calc(100dvh_-_72px_-_160px)]">
            <History />
          </div>
        </div>
      </div>

      <div className="flex w-full justify-end items-center">
        {session.data.user.role === "admin" ? (
          <Button
            size="icon"
            asChild
            className="bg-neutral-300 hover:bg-neutral-200 text-black"
          >
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
