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
        if (session.data !== undefined)
          return data.filter((user) => user.id === session.data.user.id)[0];
      return {};
    }
  }, [data, isLoading, session.status, session.data, session.data?.user.id]);

  const currentCountry = useMemo(() => {
    if (!countries.isLoading)
      return countries.data.filter((country) => country.iso === lang)[0];
    return {};
  }, [countries.data, countries.isLoading, lang]);

  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (countries.isLoading) {
    return <LoadingState size="md" />;
  }

  if (isLoading) {
    return <LoadingState size="md" />;
  }
  if (session.data === undefined) {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");

  const isUserAllowed = user?.country.some((country) => country.iso === lang);

  if (!isUserAllowed) return redirect(`/${alias}`);

  return (
    <main className="flex flex-col min-w-[768px] bg-neutral-100">
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
