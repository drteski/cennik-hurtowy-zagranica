"use client";
import { HeaderSmall } from "@/components/Layout/HeaderSmall";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

export const UsersProductsFormFields = ({
  country,
  product,
  handleChange,
  activeCountry,
  existingUserProducts,
}) => {
  if (existingUserProducts) {
    return (
      <div key={country.id}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
          <div className="flex flex-col pt-4 justify-between">
            <div>
              <HeaderSmall
                className="text-left p-0 text-2xl"
                text={country.name}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={`onlyWithSku-${product.id}`}
                  onCheckedChange={(value) =>
                    handleChange({
                      name: "onlyWithSku",
                      value,
                      id: product.country.id,
                    })
                  }
                  disabled={activeCountry}
                  defaultChecked={product.onlyWithSku}
                />
                <Label htmlFor={`onlyWithSku-${product.id}`}>
                  Only with SKU
                </Label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={`activeProduct-${product.id}`}
                  onCheckedChange={(value) =>
                    handleChange({
                      name: "activeProducts",
                      value,
                      id: product.country.id,
                    })
                  }
                  disabled={activeCountry}
                  defaultChecked={product.activeProducts}
                />
                <Label htmlFor={`activeProduct-${product.id}`}>
                  Active Products
                </Label>
              </div>
              <div className="flex gap-2 items-center">
                <Checkbox
                  id={`activeVariant-${product.id}`}
                  onCheckedChange={(value) =>
                    handleChange({
                      name: "activeVariants",
                      value,
                      id: product.country.id,
                    })
                  }
                  disabled={activeCountry}
                  defaultChecked={product.activeVariants}
                />
                <Label htmlFor={`activeVariant-${product.id}`}>
                  Active Variants
                </Label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>IDs</Label>
            <Textarea
              className="bg-white resize-none"
              rows={5}
              placeholder="1234,1234"
              onChange={(e) =>
                handleChange({
                  name: "ids",
                  value: e.target.value,
                  id: product.country.id,
                })
              }
              disabled={activeCountry}
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
                handleChange({
                  name: "variantIds",
                  value: e.target.value,
                  id: product.country.id,
                })
              }
              disabled={activeCountry}
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
                handleChange({
                  name: "skus",
                  value: e.target.value,
                  id: product.country.id,
                })
              }
              disabled={activeCountry}
              defaultValue={product.skus.join(",").toUpperCase()}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>EANs</Label>
            <Textarea
              className="bg-white resize-none"
              rows={5}
              placeholder="1234567890123,1234567890123"
              onChange={(e) =>
                handleChange({
                  name: "eans",
                  value: e.target.value,
                  id: product.country.id,
                })
              }
              disabled={activeCountry}
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
                handleChange({
                  name: "names",
                  value: e.target.value,
                  id: product.country.id,
                })
              }
              disabled={activeCountry}
              defaultValue={product.names.join(",")}
            />
          </div>
        </div>
        <Separator className="my-8" />
      </div>
    );
  }
  return (
    <div key={country.id}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
        <div className="flex flex-col pt-4 justify-between">
          <div>
            <HeaderSmall
              className="text-left p-0 text-2xl"
              text={country.name}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <Checkbox id="activeProduct" disabled />
              <Label htmlFor="activeProduct">Only with SKU</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox id="activeProduct" disabled />
              <Label htmlFor="activeProduct">Active Products</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox id="activeVariant" disabled />
              <Label htmlFor="activeVariant">Active Variants</Label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>IDs</Label>
          <Textarea
            className="bg-white resize-none"
            rows={5}
            placeholder="1234,1234"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Variant IDs</Label>
          <Textarea
            className="bg-white resize-none"
            rows={5}
            placeholder="123456,123456"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>SKUs</Label>
          <Textarea
            className="bg-white resize-none"
            rows={5}
            placeholder="ABC-12345,ABC-12345"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>EANs</Label>
          <Textarea
            className="bg-white resize-none"
            rows={5}
            placeholder="1234567890123,1234567890123"
            disabled
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Names</Label>
          <Textarea
            className="bg-white resize-none"
            rows={5}
            placeholder="kabina, brodzik, Loop"
            disabled
          />
        </div>
      </div>
      <Separator className="my-8" />
    </div>
  );
};
