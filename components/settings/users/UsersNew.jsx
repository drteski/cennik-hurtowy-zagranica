"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRef, useState } from "react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export const UsersNew = () => {
  const [tooltip, setTooltip] = useState("");
  const [role, setRole] = useState("user");
  const [activeUser, setActiveUser] = useState(false);
  const [name, setName] = useState("New user");
  const router = useRouter();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const queryClient = useQueryClient();

  const handleNew = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (
      passwordRef.current.value.length > 1 &&
      passwordRef.current.value.length < 8
    ) {
      setTooltip("Password has to be minimum 8 characters");
      return setTimeout(() => setTooltip(""), 2000);
    } else {
      await axios
        .post(`/api/users`, {
          active: activeUser,
          name,
          email,
          password,
          role,
        })
        .then((res) => {
          setTooltip(res.data.message);
          setTimeout(() => setTooltip(""), 2000);
          router.push("/settings/users");
        });
    }
  };

  const handleCountyEdit = useMutation({
    mutationFn: (e) => handleNew(e),
    onSuccess: async () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div className="relative">
      <HeaderSmall className="text-left pl-2 pr-4" text={name} />
      {tooltip !== "" && (
        <span className="absolute top-0 right-4 text-sm text-gray-500 py-2 block">
          {tooltip}
        </span>
      )}
      <form
        className="grid grid-rows-[1fr_auto] h-[calc(100dvh_-_80px_-_72px_-_40px_-_70px)] pt-10"
        onSubmit={(e) => handleCountyEdit.mutate(e)}
      >
        <div className=" overflow-y-auto pl-2 pr-4">
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <Checkbox
                id="activeUser"
                onCheckedChange={(value) => setActiveUser(value)}
              />
              <Label htmlFor="activeUser">Active</Label>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  onChange={(e) =>
                    setName(e.target.value === "" ? "New user" : e.target.value)
                  }
                  className="bg-white"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>E-Mail</Label>
                <Input ref={emailRef} className="bg-white" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Input
                  ref={passwordRef}
                  className="bg-white"
                  type="password"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Role</Label>
                <Select
                  defaultValue={role}
                  onValueChange={(value) => setRole(value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Client</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <Button className="self-end mt-4 ml-2 mr-4">Save</Button>
      </form>
    </div>
  );
};
