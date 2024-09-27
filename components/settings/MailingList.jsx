"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";

export const MailingList = ({ data }) => {
  const [tooltip, setTooltip] = useState("");
  const emailList = data
    .sort((a, b) => a.country.id - b.country.id)
    .map((email) => {
      return {
        id: email.id,
        subject: email.subject,
        emails: email.emails.join(", "),
        country: email.country.name,
      };
    });

  const handleMailingList = async (e) => {
    e.preventDefault();
    const id = parseInt(e.target.id.replace("emails-", ""));
    const subject = e.target.querySelector(`#subject-${id}`).value;
    const emails = e.target
      .querySelector(`#email-${id}`)
      .value.replace(" ", "")
      .split(",")
      .filter((e) => e !== "");
    await axios.post("/api/mailing/list", { id, subject, emails }).then(() => {
      setTooltip("Saved");
      setTimeout(() => setTooltip(""), 2000);
    });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col gap-8 row-span-4 relative">
      <h2 className="text-2xl font-bold uppercase">Mailing List</h2>
      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <div className="overflow-y-scroll grid grid-cols-1 gap-4">
        {emailList.map((list) => {
          return (
            <div className="bg-white rounded-md p-4" key={list.id}>
              <div className="flex flex-col gap-1">
                <span className="p-0 flex items-center justify-end uppercase font-bold tracking-wider">
                  {list.country}
                </span>
                <form
                  id={`emails-${list.id}`}
                  onSubmit={handleMailingList}
                  className="flex flex-col gap-2 justify-end"
                >
                  <Label htmlFor={`subject-${list.id}`}>Email subject</Label>
                  <Input
                    type="text"
                    id={`subject-${list.id}`}
                    placeholder="Subject"
                    defaultValue={list.subject}
                  />
                  <Label htmlFor={`email-${list.id}`}>Email list</Label>
                  <Textarea
                    id={`email-${list.id}`}
                    placeholder="Emails"
                    defaultValue={list.emails}
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
