"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarbonSettings } from "@/components/Layout/Icones";
import { Logo } from "@/components/Layout/Logos";
import { useSession } from "next-auth/react";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { CountriesList } from "@/components/CountriesList";
import LoadingState from "@/app/loading";
import NotFound from "@/app/not-found";
import useGetUsers from "@/hooks/useGetUsers";
import { redirect } from "next/navigation";
import { useGetSessionUser } from "@/hooks/useGetSessionUser";

const AliasPage = ({ params }) => {
  const { alias } = params;
  const aliases = ["rea", "tutumi", "toolight"];
  const session = useSession();
  // const { data, isLoading } = useGetUsers();
  // const user = useGetSessionUser(isLoading, data, session) ;

  if (!aliases.some((allAlias) => allAlias === alias)) return NotFound();
  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.data === undefined) {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  return (
    <div className="h-screen grid grid-rows-[36px_1fr_36px] p-10 min-w-[768px]">
      <NavigationBar
        user={session.data.user}
        // loadingState={isLoading}
        backPath="/"
        showUser
        showLogo={
          <div className="w-full relative">
            <Logo
              className="h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              alias={`${alias[0].toUpperCase()}${alias.slice(1, alias.length)}`}
            />
          </div>
        }
        showLogout
      />
      <div className="overflow-y-scroll h-[calc(100dvh_-_120px_-_36px_-_36px_-_40px)] my-10">
        <CountriesList
          isLoading={false}
          countries={session.data.user.country}
          alias={alias}
        />
      </div>
      <div className="flex justify-end items-center">
        {session.data.user.role === "admin" ? (
          <Button
            size="icon"
            asChild
            className="bg-neutral-300 hover:bg-neutral-200 text-black"
          >
            <Link href="/settings" title="Logout">
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
