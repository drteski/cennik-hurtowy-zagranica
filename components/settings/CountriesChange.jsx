"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

export const CountriesPasswordChange = ({ data }) => {
  const [tooltip, setTooltip] = useState("");
  const handleCountryPasswordChange = async (e) => {
    e.preventDefault();
    const id = parseInt(e.target.id.replace("countries-", ""));
    const password = e.target.querySelector(`#password-${id}`).value;
    await axios.post("/api/mailing/countries", { id, password }).then(() => {
      setTooltip("Saved");
      setTimeout(() => setTooltip(""), 2000);
    });
  };
  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-8 row-span-4 relative">
      <h2 className="text-2xl font-bold uppercase">Countries Passwords</h2>
      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <div className="overflow-y-scroll grid grid-cols-2 gap-4">
        {data
          .sort((a, b) => a.id - b.id)
          .map((country) => {
            return (
              <div className="bg-white rounded-md p-4" key={country.id}>
                <div className="flex flex-col gap-1">
                  <span className="p-0 flex items-center justify-end uppercase font-bold tracking-wider">
                    {country.name}
                  </span>
                  <span className="text-sm block p-0">
                    Code - <strong>{country.iso}</strong>
                  </span>
                  <span className="text-sm block p-0">
                    Currency - <strong>{country.currency}</strong>
                  </span>
                  <span className="text-sm block p-0">
                    Locale - <strong>{country.locale}</strong>
                  </span>
                  <form
                    id={`countries-${country.id}`}
                    className="flex flex-col gap-1 pt-4"
                    onSubmit={handleCountryPasswordChange}
                  >
                    <Label htmlFor={`password-${country.id}`}>Password</Label>
                    <Input
                      id={`password-${country.id}`}
                      defaultValue={country.password}
                      className="bg-white"
                      placeholder="Password"
                    />
                    <Button>Save</Button>
                  </form>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
