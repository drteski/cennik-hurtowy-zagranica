"use client";

import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { redirect, usePathname } from "next/navigation";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import useGetUsers from "@/hooks/useGetUsers";

const SettingsUsersLayout = ({ children }) => {
  const path = usePathname();
  const currentUser = parseInt(path.replace("/settings/users/", ""));
  const { data, isLoading } = useGetUsers();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!isLoading) {
      setUsers(data);
    }
  }, [data, isLoading]);

  const handleSearch = (e) => {
    setUsers(
      data.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  const session = useSession();
  if (session.status === "loading") {
    return <LoadingState size="md" />;
  }
  if (session.status === "unauthenticated") return redirect("/login");
  if (session.data.user.role !== "admin") return redirect("/");
  return (
    <main className="h-screen grid grid-rows-[36px_1fr] p-10 min-w-[768px] gap-10">
      <NavigationBar
        backPath="/"
        user={session.data.user}
        showUser
        showLogout
      />
      <div className="flex flex-col">
        <div className="flex gap-2">
          <Link
            className="px-3 py-2 border rounded-md text-[14px] hover:border-neutral-400 transition border-neutral-500"
            href="/settings/users"
          >
            Users
          </Link>
          <Link
            className="px-3 py-2 border border-neutral-200 text-neutral-400 rounded-md text-[14px] hover:border-neutral-400 transition"
            href="/settings/countries"
          >
            Countries
          </Link>
        </div>
        <div className="w-full h-[calc(100dvh_-_116px_-_40px_-_44px)]">
          <div className="grid grid-cols-[300px_1fr] mt-2 h-full gap-4">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="grid grid-rows-[auto_1fr_auto] gap-4 p-4 rounded-xl border border-neutral-200">
                <Input
                  onChange={handleSearch}
                  placeholder="Search"
                  className="bg-white"
                />
                <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100dvh_-_116px_-_80px_-_36px_-_32px_-_40px_-_36px)]">
                  {users.map((user) => {
                    return (
                      <Link
                        key={user.id}
                        className={`flex px-3 py-2 border border-neutral-200 font-medium rounded-lg justify-between transition hover:border-neutral-400 ${currentUser === user.id ? "border-neutral-500" : ""}`}
                        href={`/settings/users/${user.id}`}
                      >
                        <span className="flex flex-col gap-2">
                          {user.name}
                          <span className="text-[10px] flex items-center uppercase text-neutral-400 font-normal">
                            ( {user.role === "user" ? "client" : user.role} )
                          </span>
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/settings/users/new">New user</Link>
                </Button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsUsersLayout;
