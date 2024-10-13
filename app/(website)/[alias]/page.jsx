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
import { useMemo } from "react";
import useGetUsers from "@/hooks/useGetUsers";
import { redirect } from "next/navigation";

const AliasPage = ({ params }) => {
  const { alias } = params;
  const aliases = ["rea", "tutumi", "toolight"];
  const session = useSession();
  const { data, isLoading } = useGetUsers();
  const user = useMemo(() => {
    if (!isLoading) {
      if (session.status === "authenticated")
        return data.filter((user) => user.id === session.data.user.id)[0];
      return {};
    }
    return {};
  }, [data, isLoading, session.status]);
  if (!aliases.some((allAlias) => allAlias === alias)) return NotFound();
  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  return (
    <div className="h-screen grid grid-rows-[36px_auto_1fr_36px] p-10 min-w-[768px]">
      <NavigationBar
        user={user}
        loadingState={isLoading}
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
        <CountriesList user={user} alias={alias} />
      </div>
      <div className="flex justify-end items-center">
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
    </div>
  );
};

export default AliasPage;
