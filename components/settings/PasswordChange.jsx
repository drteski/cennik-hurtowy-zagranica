"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";

export const PasswordChange = () => {
  const passwordRef = useRef(null);
  const repeatPasswordRef = useRef(null);
  const [tooltip, setTooltip] = useState("");
  const handlePassword = async (e) => {
    e.preventDefault();
    if (
      passwordRef.current.value === "" ||
      repeatPasswordRef.current.value === ""
    ) {
      setTooltip("You have to input passwords in both fields");
      return setTimeout(() => setTooltip(""), 2000);
    }
    if (passwordRef.current.value !== repeatPasswordRef.current.value) {
      setTooltip("Passwords are not exact");
      return setTimeout(() => setTooltip(""), 2000);
    }

    await axios
      .put("/api/auth/settings", { pass: passwordRef.current.value })
      .then(() => {
        setTooltip("Password changed");
        setTimeout(() => setTooltip(""), 2000);
      });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-8 row-start-5 relative row-end-8">
      <h2 className="text-2xl font-bold uppercase">Settings Password</h2>
      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <div>
        <form onSubmit={handlePassword} className="flex flex-col gap-2">
          <Input
            ref={passwordRef}
            className="bg-white"
            placeholder="Password"
            type="password"
          />
          <Input
            ref={repeatPasswordRef}
            className="bg-white"
            placeholder="Repeat Password"
            type="password"
          />

          <Button>Save</Button>
        </form>
      </div>
    </div>
  );
};
