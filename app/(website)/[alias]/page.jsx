"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarbonSettings } from "@/components/Icones";
import { Logo } from "@/components/Logos";
import { useSession } from "next-auth/react";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { CountriesList } from "@/components/CountriesList";
import LoadingState from "@/app/loading";
import NotFound from "@/app/not-found";

const AliasPage = ({ params }) => {
  const { alias } = params;
  const aliases = ["rea", "tutumi", "toolight"];
  const session = useSession();
  if (!aliases.some((al) => al === alias)) return NotFound();
  if (session.status === "loading") {
    return <LoadingState />;
  }
  return (
    <div className="h-screen grid grid-rows-[36px_auto_1fr_36px] p-10 min-w-[768px]">
      <NavigationBar
        user={session.data.user}
        backPath="/"
        showUser
        showLogout
      />
      <div className="p-10 flex h-[300px] items-center justify-center">
        <Logo
          className="w-96"
          alias={`${alias[0].toUpperCase()}${alias.slice(1, alias.length)}`}
        />
      </div>
      <div>
        <CountriesList user={session.data.user} alias={alias} />
      </div>
      <div className="flex justify-end items-center">
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
    </div>
  );
};

export default AliasPage;
