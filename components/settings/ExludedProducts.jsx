"use client";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const ExcludedProducts = ({ data }) => {
  const variantIdsRef = useRef(null);
  const skusRef = useRef(null);
  const eansRef = useRef(null);
  const namesRef = useRef(null);
  const [tooltip, setTooltip] = useState("");

  const handleExclude = async (e) => {
    e.preventDefault();

    await axios
      .post("/api/settings/exclude", {
        variantIds: variantIdsRef.current.value
          .replace(", ", ",")
          .replace(" , ", ",")
          .replace(" ,", ",")
          .split(",")
          .map((ids) => parseInt(ids)),
        eans: eansRef.current.value
          .replace(", ", ",")
          .replace(" , ", ",")
          .replace(" ,", ",")
          .split(","),
        skus: skusRef.current.value
          .replace(", ", ",")
          .replace(" , ", ",")
          .replace(" ,", ",")
          .split(","),
        names: namesRef.current.value
          .replace(", ", ",")
          .replace(" , ", ",")
          .replace(" ,", ",")
          .split(","),
      })
      .then(() => {
        setTooltip("Saved");
        setTimeout(() => setTooltip(""), 2000);
      });
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex flex-col col-start-2 col-end-7 gap-8 row-start-5 relative row-end-8">
      <h2 className="text-2xl font-bold uppercase">Exclude Products</h2>
      {tooltip !== "" && (
        <span className="absolute top-4 right-4 text-sm text-gray-500 py-4 block">
          {tooltip}
        </span>
      )}
      <div>
        <form onSubmit={handleExclude} className="flex flex-col gap-2">
          <div className="flex gap-2 justify-center">
            <div className="w-full">
              <Label htmlFor="variantids">Variant IDs</Label>
              <Textarea
                id="variantids"
                className="resize-none bg-white"
                placeholder="Variant IDs"
                ref={variantIdsRef}
                rows={14}
                defaultValue={data.variantIds.join(", ")}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="skus">SKUs</Label>
              <Textarea
                id="skus"
                className="resize-none bg-white"
                placeholder="SKUs"
                ref={skusRef}
                rows={14}
                defaultValue={data.skus.join(", ")}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="eans">EANs</Label>
              <Textarea
                id="eans"
                className="resize-none bg-white"
                placeholder="EANs"
                ref={eansRef}
                rows={14}
                defaultValue={data.eans.join(", ")}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="names">Names</Label>
              <Textarea
                id="names"
                className="resize-none bg-white"
                placeholder="Names"
                ref={namesRef}
                rows={14}
                defaultValue={data.names.join(", ")}
              />
            </div>
          </div>

          <Button>Save</Button>
        </form>
      </div>
    </div>
  );
};
