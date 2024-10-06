"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarbonChevronLeft, CarbonLogout } from "@/components/Icones";
import { signOut } from "next-auth/react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";

export const NavigationBar = ({
  user,
  country,
  backPath,
  showCountry,
  showLogout,
  showUser,
}) => {
  return (
    <div
      className={`w-full gap-4 grid ${backPath !== "" && showCountry && showUser && showLogout ? "grid-cols-[36px_1fr_256px_36px]" : !showCountry && showUser && showLogout && backPath !== "" ? "grid-cols-[36px_1fr_36px]" : "grid-cols-[1fr_36px]"} items-center`}
    >
      {backPath !== "" && (
        <Button size="icon" asChild>
          <Link href={backPath}>
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      )}
      {showCountry && <HeaderSmall text={country.name} />}
      {showUser && (
        <Button className="justify-self-end" asChild>
          <Link className="uppercase" href={`/user/${user.id}`}>
            {user.name}
          </Link>
        </Button>
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
