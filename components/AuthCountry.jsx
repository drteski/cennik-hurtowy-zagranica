"use client";

import { Input } from "@/components/ui/input";
import cookieCutter from "@boiseitguru/cookie-cutter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CarbonChevronLeft } from "@/components/Icones";

const AuthCountry = ({ country, lang }) => {
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();
  const authorize = async (e) => {
    e.preventDefault();
    await axios.post("/api/auth", { pass, lang }).then((data) => {
      setError(!data.data.authorized);
      cookieCutter.set("authorized", `${data.data.authorized}`);
      cookieCutter.set("lang", lang);
      router.refresh();
    });
  };

  return (
    <div className="h-[100dvh] w-[100dvw] grid grid-cols-1 grid-rows-[116px_auto] min-w-[768px]">
      <div className="p-10">
        <Button size="icon" asChild>
          <Link href="/">
            <CarbonChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
      </div>
      <div className="flex justify-center items-center">
        <form onSubmit={authorize}>
          <h1 className="text-7xl text-center font-bold mb-16">{country}</h1>
          {error ? (
            <p className="uppercase text-red-600 text-center">Wrong password</p>
          ) : (
            ""
          )}
          <Input
            className="w-96 my-4"
            onChange={(e) => setPass(e.target.value)}
            type="password"
            defaultValue={pass}
            placeholder="Password"
          />
          <Button className="w-full">Unlock</Button>
        </form>
      </div>
    </div>
  );
};

export default AuthCountry;
