"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useGetUser from "@/hooks/useGetUser";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetCountries from "@/hooks/useGetCountries";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersProductsEdit } from "@/components/settings/users/UsersProductsEdit";

export const UsersEdit = ({ id }) => {
  const [tooltip, setTooltip] = useState("");
  const [role, setRole] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const { data, isLoading } = useGetUser(id);
  const countries = useGetCountries();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading) {
      setRole(data.role);
      setActiveUser(data.active);
      setUserProducts(data.userProducts);
      return setSelectedCountries((prevState) => [
        ...prevState,
        ...data.country.map((country) => country.id),
      ]);
    }
  }, [data, isLoading]);

  const handleEdit = async (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    await axios
      .post(`/api/users/${id}`, {
        active: activeUser,
        name,
        email,
        password,
        countries: selectedCountries,
        role,
      })
      .then(() => {
        setTooltip("Saved");
        setTimeout(() => setTooltip(""), 2000);
      });
  };

  const handleCountyEdit = useMutation({
    mutationFn: (e) => handleEdit(e),
    onSuccess: async () => {
      queryClient.invalidateQueries(["user", id]);
      queryClient.invalidateQueries(["users"]);
    },
  });

  return (
    <div className="relative">
      {isLoading ? (
        <Skeleton className="w-1/2 h-9" />
      ) : (
        <HeaderSmall className="text-left" text={data.name} />
      )}
      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <form
        className="grid grid-rows-[1fr_auto] h-[calc(100dvh_-_80px_-_72px_-_40px_-_70px)] pt-10"
        onSubmit={(e) => handleCountyEdit.mutate(e)}
      >
        <div className=" overflow-y-auto">
          <div className="flex flex-col">
            {isLoading ? (
              <Skeleton className="w-full h-[16px]" />
            ) : (
              <div className="flex gap-2 items-center">
                <Checkbox
                  id="activeUser"
                  onCheckedChange={(value) => setActiveUser(value)}
                  defaultChecked={data.active}
                />
                <Label htmlFor="activeUser">Active</Label>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {isLoading ? (
                <Skeleton className="w-full h-[58px]" />
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    ref={nameRef}
                    className="bg-white"
                    defaultValue={data.name}
                  />
                </div>
              )}
              {isLoading ? (
                <Skeleton className="w-full h-[58px]" />
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>E-Mail</Label>
                  <Input
                    ref={emailRef}
                    className="bg-white"
                    defaultValue={data.email}
                  />
                </div>
              )}
              {isLoading ? (
                <Skeleton className="w-full h-[58px]" />
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>Password</Label>
                  <Input
                    ref={passwordRef}
                    className="bg-white"
                    type="password"
                    autoComplete="current-password"
                  />
                </div>
              )}
              {isLoading ? (
                <Skeleton className="w-full h-[58px]" />
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>Role</Label>
                  <Select
                    defaultValue={data.role}
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
              )}
            </div>
          </div>
          <div className="pt-10">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
              {countries.isLoading ? (
                Array.from(Array(26).keys()).map((key) => (
                  <Skeleton key={key} className="w-24 h-4" />
                ))
              ) : (
                <>
                  {isLoading ? (
                    Array.from(Array(26).keys()).map((key) => (
                      <Skeleton key={key} className="w-24 h-4" />
                    ))
                  ) : (
                    <>
                      {countries.data.map((country) => {
                        const isUserCountry = data.country.some(
                          (userCountry) => userCountry.id === country.id,
                        );
                        return (
                          <div
                            key={country.id}
                            className="flex gap-2 items-center"
                          >
                            <Checkbox
                              id={`country-${country.id}`}
                              onCheckedChange={(value) => {
                                if (value) {
                                  setSelectedCountries((prevState) => [
                                    ...prevState,
                                    country.id,
                                  ]);
                                } else {
                                  setSelectedCountries((prevState) =>
                                    prevState.filter(
                                      (state) => state !== country.id,
                                    ),
                                  );
                                }
                              }}
                              defaultChecked={isUserCountry}
                            />
                            <Label htmlFor={`country-${country.id}`}>
                              {country.name}
                            </Label>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <UsersProductsEdit
              userProducts={userProducts}
              setUserProducts={setUserProducts}
            />
          )}
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-9" />
        ) : (
          <Button className="self-end">Save</Button>
        )}
      </form>
    </div>
  );
};
