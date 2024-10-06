"use client";
import { TableContainer } from "@/components/tables/TableContainer";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { redirect } from "next/navigation";
import { NavigationBar } from "@/components/Layout/NavigationBar";

const LangPage = ({ params }) => {
  const { alias, lang } = params;
  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState />;
  }
  const isUserAllowed = session.data.user.country.some(
    (country) => country.iso === lang,
  );
  if (!isUserAllowed) return redirect(`/${alias}`);

  const currentCountry = session.data.user.country.filter(
    (country) => country.iso === lang,
  )[0];

  return (
    <main className="flex flex-col min-w-[768px]">
      <div className="p-10 flex justify-between items-center">
        <NavigationBar
          user={session.data.user}
          country={currentCountry}
          backPath={`/${alias}`}
          showUser
          showLogout
          showCountry
        />
      </div>
      <TableContainer
        country={currentCountry}
        alias={alias}
        user={session.data.user.id}
      />
    </main>
  );
};
export default LangPage;
