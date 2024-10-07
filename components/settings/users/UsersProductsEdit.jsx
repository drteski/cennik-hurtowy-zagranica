"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useMemo, useState } from "react";

export const UsersProductsEdit = ({ userProducts, setUserProducts }) => {
  const [selectedCountry, setSelectedCountry] = useState("");

  const countries = useMemo(() => {
    return userProducts.map((product, index) => {
      if (index === 0) setSelectedCountry(`${product.country.id}`);
      return product.country;
    });
  }, [userProducts]);

  const handleUserProductChange = (payload) => {
    const { value, name } = payload;
    return setUserProducts((prevState) => {
      return [
        ...prevState.reduce((prevValue, currValue) => {
          if (parseInt(currValue.country.id) === parseInt(selectedCountry)) {
            if (name === "activeVariants" || name === "activeProducts") {
              return [...prevValue, { ...currValue, [`${name}`]: value }];
            } else {
              return [
                ...prevValue,
                { ...currValue, [`${name}`]: value.split(",") },
              ];
            }
          } else {
            return [...prevValue, currValue];
          }
        }, []),
      ];
    });
  };

  return (
    <div className="">
      {countries.length === 0 ? (
        <></>
      ) : (
        <>
          {countries.length === 0 ? (
            <Skeleton className="w-full h-[58px]" />
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Hide products for</Label>
              <Select
                defaultValue={`${selectedCountry}`}
                onValueChange={(value) => setSelectedCountry(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((country) => {
                      return (
                        <SelectItem
                          key={`${country.id}`}
                          value={`${country.id}`}
                        >
                          {country.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          {countries.length === 0 ? (
            <Skeleton className="w-full h-[140px] mt-10" />
          ) : (
            <div className="flex flex-col gap-10 pt-10">
              {userProducts
                .filter((product) => {
                  return product.country.id === parseInt(selectedCountry);
                })
                .map((product) => {
                  return (
                    <div
                      key={product.id}
                      className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4"
                    >
                      <div className="flex flex-col pt-10 gap-4">
                        <div className="flex gap-2 items-center">
                          <Checkbox
                            id="activeProduct"
                            onCheckedChange={(value) =>
                              handleUserProductChange({
                                name: "activeProducts",
                                value,
                              })
                            }
                            defaultChecked={product.activeProducts}
                          />
                          <Label htmlFor="activeProduct">Active Products</Label>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Checkbox
                            id="activeVariant"
                            onCheckedChange={(value) =>
                              handleUserProductChange({
                                name: "activeVariants",
                                value,
                              })
                            }
                            defaultChecked={product.activeVariants}
                          />
                          <Label htmlFor="activeVariant">Active Variants</Label>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>IDs</Label>
                        <Textarea
                          className="bg-white resize-none"
                          rows={5}
                          placeholder="1234,1234"
                          onChange={(e) =>
                            handleUserProductChange({
                              name: "ids",
                              value: e.target.value,
                            })
                          }
                          defaultValue={product.ids.join(",")}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Variant IDs</Label>
                        <Textarea
                          className="bg-white resize-none"
                          rows={5}
                          placeholder="123456,123456"
                          onChange={(e) =>
                            handleUserProductChange({
                              name: "variantIds",
                              value: e.target.value,
                            })
                          }
                          defaultValue={product.variantIds.join(",")}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>SKUs</Label>
                        <Textarea
                          className="bg-white resize-none"
                          rows={5}
                          placeholder="ABC-12345,ABC-12345"
                          onChange={(e) =>
                            handleUserProductChange({
                              name: "skus",
                              value: e.target.value,
                            })
                          }
                          defaultValue={product.skus.join(",")}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>EANs</Label>
                        <Textarea
                          className="bg-white resize-none"
                          rows={5}
                          placeholder="1234567890123,1234567890123"
                          onChange={(e) =>
                            handleUserProductChange({
                              name: "eans",
                              value: e.target.value,
                            })
                          }
                          defaultValue={product.eans.join(",")}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Names</Label>
                        <Textarea
                          className="bg-white resize-none"
                          rows={5}
                          placeholder="kabina, brodzik, Loop"
                          onChange={(e) =>
                            handleUserProductChange({
                              name: "names",
                              value: e.target.value,
                            })
                          }
                          defaultValue={product.names.join(",")}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
