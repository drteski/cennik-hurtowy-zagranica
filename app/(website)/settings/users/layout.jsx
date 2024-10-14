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
          <Button className="bg-gray-500" asChild>
            <Link href="/settings/users">Users</Link>
          </Button>
          <Button asChild>
            <Link href="/settings/countries">Countries</Link>
          </Button>
        </div>
        <div className="w-full h-[calc(100dvh_-_116px_-_40px_-_36px)]">
          <div className="bg-gray-100 grid grid-cols-[300px_1fr] rounded-lg mt-2 h-full py-4">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="grid grid-rows-[auto_1fr_auto] gap-4 pl-4 pr-2">
                <Input
                  onChange={handleSearch}
                  placeholder="Search"
                  className="bg-white"
                />
                <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100dvh_-_116px_-_80px_-_36px_-_32px_-_32px_-_36px)]">
                  {users.map((user) => {
                    return (
                      <Button
                        key={user.id}
                        asChild
                        className={`${currentUser === user.id ? "bg-gray-500" : ""}`}
                      >
                        <Link
                          className="flex justify-between items-center"
                          href={`/settings/users/${user.id}`}
                        >
                          {user.role === "admin" ? (
                            <span className="flex items-center gap-1">
                              {user.name}
                              <span className="text-[9px] flex items-center uppercase opacity-50">
                                ({user.role})
                              </span>
                            </span>
                          ) : (
                            <>{user.name}</>
                          )}

                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
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
