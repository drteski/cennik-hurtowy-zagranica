"use client";
import { TableContainer } from "@/components/tables/TableContainer";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { redirect } from "next/navigation";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import useGetUsers from "@/hooks/useGetUsers";
import { useMemo } from "react";
import useGetCountries from "@/hooks/useGetCountries";

const LangPage = ({ params }) => {
  const { alias, lang } = params;
  const session = useSession();
  const { data, isLoading } = useGetUsers();
  const countries = useGetCountries();

  const user = useMemo(() => {
    if (!isLoading) {
      if (session.status === "authenticated")
        return data.filter((user) => user.id === session.data.user.id)[0];
      return {};
    }
  }, [data, isLoading, session.status]);

  const currentCountry = useMemo(() => {
    if (!countries.isLoading)
      return countries.data.filter((country) => country.iso === lang)[0];
    return {};
  }, [countries.data, countries.isLoading]);

  if (session.status === "loading") {
    return <LoadingState />;
  }
  if (countries.isLoading) {
    return <LoadingState />;
  }
  if (isLoading) {
    return <LoadingState />;
  }
  if (session.status === "unauthenticated") return redirect("/login");

  const isUserAllowed = user?.country.some((country) => country.iso === lang);

  if (!isUserAllowed) return redirect(`/${alias}`);

  return (
    <main className="flex flex-col min-w-[768px]">
      <div className="p-10 flex justify-between items-center">
        <NavigationBar
          user={user}
          loadingState={isLoading}
          country={currentCountry}
          backPath={`/${alias}`}
          showUser
          showLogout
          showCountry
        />
      </div>
      <TableContainer country={currentCountry} alias={alias} user={user.id} />
    </main>
  );
};
export default LangPage;
