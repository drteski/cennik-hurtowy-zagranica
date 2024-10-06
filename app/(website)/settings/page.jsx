"use client";

import { NavigationBar } from "@/components/Layout/NavigationBar";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "@/components/settings/users/Users";
import { Countries } from "@/components/settings/countries/Countries";

const SettingsPage = () => {
  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState />;
  }
  if (session.data.user.role !== "admin") return redirect("/");
  return (
    <main className="h-screen grid grid-rows-[36px_1fr] p-10 min-w-[768px] gap-10">
      <NavigationBar
        backPath="/"
        user={session.data.user}
        showUser
        showLogout
      />
      <Tabs
        defaultValue="users"
        className="w-full h-[calc(100dvh_-_116px_-_40px)]"
      >
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
        </TabsList>
        <TabsContent className="h-[calc(100dvh_-_116px_-_80px)]" value="users">
          <Users />
        </TabsContent>
        <TabsContent
          className="h-[calc(100dvh_-_116px_-_80px)]"
          value="countries"
        >
          <Countries />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SettingsPage;
