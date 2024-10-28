"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PodlasiakLogo } from "@/components/Layout/Icones";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});
const LoginPage = () => {
  const [tooltip, setTooltip] = useState("");
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values) => {
    if (values.login === "" || values.password === "") {
      setTooltip("Fill email and password fields");
      return setTimeout(() => setTooltip(""), 2000);
    }
    return await signIn("credentials", {
      ...values,
      callbackUrl: "/",
      redirect: false,
    }).then(({ ok, error }) => {
      if (error) {
        setTooltip("Wrong password or email");
        return setTimeout(() => setTooltip(""), 2000);
      }
      return router.push("/");
    });
  };

  return (
    <div className="flex h-full items-center justify-center min-w-[768px]">
      <div className="flex flex-col relative items-center gap-10 justify-center h-2/3 w-full px-20">
        <PodlasiakLogo className="fill-gray-100 h-36 mb-28" />
        <Form {...form}>
          <form
            className="flex flex-col justify-center"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-100 w-64"
                      placeholder="E-Mail"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-gray-100 w-64"
                      placeholder="Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="dark mt-4">Log in</Button>
          </form>
        </Form>
        {tooltip !== "" && (
          <span className="absolute bottom-20 text-sm text-red-400 block">
            {tooltip}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
