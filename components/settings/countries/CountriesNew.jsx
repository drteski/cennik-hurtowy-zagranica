"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRef, useState } from "react";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const CountriesNew = () => {
  const [tooltip, setTooltip] = useState("");
  const [countryName, setCountryName] = useState("New country");
  const router = useRouter();
  const isoRef = useRef(null);
  const nameRef = useRef(null);
  const currencyRef = useRef(null);
  const localeRef = useRef(null);
  const subjectRef = useRef(null);
  const queryClient = useQueryClient();
  const handleNew = async (e) => {
    e.preventDefault();
    const iso = isoRef.current.value;
    const name = nameRef.current.value;
    const currency = currencyRef.current.value;
    const locale = localeRef.current.value;
    const subject = subjectRef.current.value;
    await axios
      .put(`/api/country/`, { iso, name, currency, locale, subject })
      .then((res) => {
        setTooltip("Saved");
        setTimeout(() => setTooltip(""), 2000);
        router.push(`/settings/country/${res.data.country.id}`);
      });
  };

  const handleCountyNew = useMutation({
    mutationFn: (e) => handleNew(e),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["countries"]);
    },
  });

  return (
    <div className="relative">
      <HeaderSmall className="text-left" text={countryName} />

      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <form
        className="flex flex-col gap-4 pt-10"
        onSubmit={(e) => handleCountyNew.mutate(e)}
      >
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            ref={nameRef}
            onChange={(e) => {
              if (e.target.value === "") {
                setCountryName("New country");
              } else {
                setCountryName(e.target.value);
              }
            }}
            className="bg-white"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Country Code</Label>
          <Input ref={isoRef} className="bg-white" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Locale</Label>
          <Input ref={localeRef} className="bg-white" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Currency</Label>
          <Input ref={currencyRef} className="bg-white" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Subject</Label>
          <Input ref={subjectRef} className="bg-white" required />
        </div>
        <Button>Save</Button>
      </form>
    </div>
  );
};
