"use client";

import { NavigationBar } from "@/components/Layout/NavigationBar";
import LoadingState from "@/app/loading";
import { useSession } from "next-auth/react";
import { HeaderMain } from "@/components/Layout/HeaderMain";

const NotFound = () => {
  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState />;
  }
  return (
    <div className="h-screen grid grid-rows-[36px_1fr] p-10 min-w-[768px]">
      <NavigationBar backPath="/" />
      <div className="flex flex-col items-center justify-center h-full">
        <HeaderMain text="404" className="text-9xl font-bold mb-4" />
        <p className="uppercase mb-20">Page not found</p>
      </div>
    </div>
  );
};

export default NotFound;
