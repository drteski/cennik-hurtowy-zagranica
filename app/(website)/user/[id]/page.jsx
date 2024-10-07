"use client";
import { NavigationBar } from "@/components/Layout/NavigationBar";
import { useSession } from "next-auth/react";
import LoadingState from "@/app/loading";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useGetUser from "@/hooks/useGetUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { redirect } from "next/navigation";
import { HeaderMain } from "@/components/Layout/HeaderMain";
import { HeaderMedium } from "@/components/Layout/HeaderMedium";

const UserPage = ({ params }) => {
  const session = useSession();
  const [tooltip, setTooltip] = useState("");
  const queryClient = useQueryClient();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { data, isLoading } = useGetUser(parseInt(params.id));

  const handleUser = async (e) => {
    e.preventDefault();
    if (
      passwordRef.current.value.length > 1 &&
      passwordRef.current.value.length < 8
    ) {
      setTooltip("Password has to be minimum 8 characters");
      return setTimeout(() => setTooltip(""), 2000);
    } else {
      await axios
        .put(`/api/users/${params.id}`, {
          name: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        })
        .then((res) => {
          console.log(res.data.message);
          setTooltip(res.data.message);
          setTimeout(() => setTooltip(""), 2000);
        });
    }
  };

  const handleCreateUser = useMutation({
    mutationFn: (e) => handleUser(e),
    onSuccess: () => queryClient.invalidateQueries(["users", params.id]),
  });

  if (session.status === "loading") {
    return <LoadingState />;
  }
  if (params.id !== session.data.user.id.toString()) return redirect("/");

  return (
    <main className="flex flex-col min-w-[768px] h-screen relative">
      <div className="p-10 flex justify-between items-center">
        <NavigationBar user={session.data.user} backPath={`/`} showLogout />
      </div>
      <div className="grid grid-rows-[auto_auto_1fr] justify-center h-full  p-10">
        <HeaderMain text="Profile edit" />
        {isLoading ? (
          <Skeleton className="h-[40px] w-full my-20" />
        ) : (
          <HeaderMedium text={data.name} className="py-20" />
        )}

        <form
          className="flex flex-col gap-2 w-[500px]"
          onSubmit={(e) => handleCreateUser.mutate(e)}
        >
          {isLoading ? (
            <Skeleton className="h-14 w-full mt-8" />
          ) : (
            <>
              <Label className="mt-8">Name</Label>
              <Input ref={nameRef} defaultValue={data.name} type="text" />
            </>
          )}

          {isLoading ? (
            <Skeleton className="h-14 w-full mt-8" />
          ) : (
            <>
              <Label className="mt-8">E-Mail</Label>
              <Input
                ref={emailRef}
                defaultValue={data.email}
                autoComplete="email"
                type="email"
              />
            </>
          )}

          {isLoading ? (
            <Skeleton className="h-14 w-full mt-8" />
          ) : (
            <>
              <Label className="mt-8">Password</Label>
              <Input ref={passwordRef} type="password" />
            </>
          )}

          <Button>Save</Button>
        </form>
      </div>
      {tooltip !== "" && (
        <span className="absolute bottom-36 w-full text-center text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
    </main>
  );
};

export default UserPage;
