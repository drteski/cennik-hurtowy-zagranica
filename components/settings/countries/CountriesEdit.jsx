"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRef, useState } from "react";
import useGetCountry from "@/hooks/useGetCountry";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CountriesEdit = ({ id }) => {
  const [tooltip, setTooltip] = useState("");
  const { data, isLoading } = useGetCountry(id);
  const isoRef = useRef(null);
  const nameRef = useRef(null);
  const currencyRef = useRef(null);
  const localeRef = useRef(null);
  const subjectRef = useRef(null);
  const queryClient = useQueryClient();
  const handleEdit = async (e) => {
    e.preventDefault();
    const iso = isoRef.current.value;
    const name = nameRef.current.value;
    const currency = currencyRef.current.value;
    const locale = localeRef.current.value;
    const subject = subjectRef.current.value;
    await axios
      .post(`/api/country/${id}`, { iso, name, currency, locale, subject })
      .then(() => {
        setTooltip("Saved");
        setTimeout(() => setTooltip(""), 2000);
      });
  };

  const handleCountyEdit = useMutation({
    mutationFn: (e) => handleEdit(e),
    onSuccess: async () => {
      queryClient.invalidateQueries(["country", id]);
      queryClient.invalidateQueries(["countries"]);
    },
  });

  return (
    <div className="relative">
      {isLoading ? (
        <Skeleton className="w-full h-9" />
      ) : (
        <HeaderSmall className="text-left" text={data.name} />
      )}
      {tooltip !== "" && (
        <span className="absolute top-0 right-4 text-sm text-gray-500 py-2 block">
          {tooltip}
        </span>
      )}
      <form
        className="flex flex-col gap-4 pt-10"
        onSubmit={(e) => handleCountyEdit.mutate(e)}
      >
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
            <Label>Country Code</Label>
            <Input
              ref={isoRef}
              className="bg-white"
              defaultValue={data.iso}
              disabled
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-[58px]" />
        ) : (
          <div className="flex flex-col gap-2">
            <Label>Locale</Label>
            <Input
              ref={localeRef}
              className="bg-white"
              defaultValue={data.locale}
              disabled
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-[58px]" />
        ) : (
          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            <Input
              ref={currencyRef}
              className="bg-white"
              defaultValue={data.currency}
              disabled
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-[58px]" />
        ) : (
          <div className="flex flex-col gap-2">
            <Label>Subject</Label>
            <Input
              ref={subjectRef}
              className="bg-white"
              defaultValue={data.subject}
            />
          </div>
        )}
        {isLoading ? (
          <Skeleton className="w-full h-9" />
        ) : (
          <Button>Save</Button>
        )}
      </form>
    </div>
  );
};
