"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CarbonChevronLeft,
  CarbonLogout,
  PodlasiakLogo,
} from "@/components/Layout/Icones";
import { signOut } from "next-auth/react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { Skeleton } from "@/components/ui/skeleton";

export const NavigationBar = ({
  user,
  country,
  backPath,
  showCountry,
  showLogout,
  showUser,
  loadingState,
}) => {
  return (
    <div
      className={`w-full gap-4 grid ${backPath !== "" && showCountry && showUser && showLogout ? "grid-cols-[auto_auto_1fr_256px_36px]" : !showCountry && showUser && showLogout && backPath !== "" ? "grid-cols-[auto_auto_1fr_36px]" : "grid-cols-[auto_1fr_36px]"} items-center`}
    >
      <Link className="relative w-[190px]" href="/">
        <PodlasiakLogo className="fill-podlasiak h-14 absolute -top-7 left-0" />
      </Link>
      {backPath !== "" && (
        <Button
          className="ml-20 bg-neutral-300 hover:bg-neutral-200 text-black"
          size="icon"
          asChild
        >
          <Link href={backPath}>
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      {showCountry && (
        <HeaderSmall
          text={country.name}
          className="font-bold text-neutral-600"
        />
      )}
      {showUser && (
        <>
          {loadingState ? (
            <Skeleton className="justify-self-end h-9 w-64" />
          ) : (
            <Button
              className="justify-self-end bg-neutral-900 hover:bg-neutral-800"
              asChild
            >
              <Link className="uppercase" href={`/user/${user?.id}`}>
                {user?.name}
              </Link>
            </Button>
          )}
        </>
      )}
      {showLogout && (
        <Button
          size="icon"
          className="justify-self-end bg-neutral-300 hover:bg-neutral-200 text-black"
          onClick={() => signOut()}
        >
          <CarbonLogout />
        </Button>
      )}
    </div>
  );
};
