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
      <Link href="/">
        <PodlasiakLogo className="fill-podlasiak h-9" />
      </Link>
      {backPath !== "" && (
        <Button className="ml-20" size="icon" asChild>
          <Link href={backPath}>
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      {showCountry && <HeaderSmall text={country.name} />}
      {showUser && (
        <>
          {loadingState ? (
            <Skeleton className="justify-self-end h-9 w-64" />
          ) : (
            <Button className="justify-self-end" asChild>
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
          className="justify-self-end"
          onClick={() => signOut()}
        >
          <CarbonLogout />
        </Button>
      )}
    </div>
  );
};
