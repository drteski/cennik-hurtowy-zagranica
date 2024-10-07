"use client";
import Link from "next/link";
import { Logo } from "@/components/Layout/Logos";
import { HeaderMain } from "@/components/Layout/HeaderMain";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { useSession } from "next-auth/react";
import NotFound from "@/app/not-found";
import LoadingState from "@/app/loading";
import { Button } from "@/components/ui/button";
import { CarbonSettings } from "@/components/Layout/Icones";

const BasePage = () => {
  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState />;
  }
  return (
    <main className="h-screen flex flex-col justify-center items-center min-w-[768px] p-10">
      <NavigationBar
        user={session.data.user}
        backPath={""}
        showUser
        showLogout
      />
      <div className="flex items-center justify-center h-1/3 w-full">
        <HeaderMain text="Podlasiak" className="text-9xl" />
      </div>
      <div className="flex items-center gap-10 justify-center h-2/3 w-full px-20">
        <Link
          href="/rea"
          className="bg-gray-100 w-1/3 flex items-center justify-center lg:p-20 p-10 rounded-2xl transition hover:scale-105"
        >
          <Logo alias="Rea" />
        </Link>
        <Link
          href="/toolight"
          className="bg-gray-100 w-1/3 flex items-center justify-center lg:p-20 p-10 rounded-2xl transition hover:scale-105"
        >
          <Logo alias="Toolight" />
        </Link>
        <Link
          href="/tutumi"
          className="bg-gray-100 w-1/3 flex items-center justify-center lg:p-20 p-10 rounded-2xl transition hover:scale-105"
        >
          <Logo alias="Tutumi" />
        </Link>
      </div>
      <div className="flex w-full justify-end items-center">
        {session.data.user.role === "admin" ? (
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
