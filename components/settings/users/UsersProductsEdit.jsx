"use client";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { UsersProductsFormFields } from "@/components/settings/users/UsersProductsFormFields";

export const UsersProductsEdit = ({
  userProducts,
  setUserProducts,
  allCountries,
  userCountries,
}) => {
  const countries = useMemo(() => {
    return userProducts.map((product) => product.country);
  }, [userProducts]);

  const handleUserProductChange = (payload) => {
    const { value, name, id } = payload;
    return setUserProducts((prevState) => {
      return [
        ...prevState.reduce((prevValue, currValue) => {
          if (currValue.country.id === id) {
            if (
              name === "activeVariants" ||
              name === "activeProducts" ||
              name === "onlyWithSku"
            ) {
              return [...prevValue, { ...currValue, [`${name}`]: value }];
            } else {
              const finalValue = value
                .split(",")
                .filter((val) => {
                  if (name === "ids" || name === "variantIds") {
                    return !isNaN(parseInt(val));
                  }
                  return val !== "";
                })
                .reduce((prevValue, currValue) => {
                  const prevIndex = prevValue.findIndex(
                    (val) => val.toLowerCase() === currValue.toLowerCase(),
                  );
                  if (prevIndex !== -1) return prevValue;
                  return [...prevValue, currValue];
                }, []);

              return [...prevValue, { ...currValue, [`${name}`]: finalValue }];
            }
          } else {
            return [...prevValue, currValue];
          }
        }, []),
      ];
    });
  };

  console.log(userProducts);

  return (
    <div className="">
      {countries.length === 0 ? (
        <></>
      ) : (
        <>
          {countries.length === 0 ? (
            <Skeleton className="w-1/4 h-[18px]" />
          ) : (
            <Label>Hide products for</Label>
          )}
          {countries.length === 0 ? (
            <Skeleton className="w-full h-[140px] mt-4" />
          ) : (
            <div className="flex flex-col gap-4 pt-4">
              {allCountries.map((country) => {
                const existingUserProductsIndex = userProducts.findIndex(
                  (products) => products.country.id === country.id,
                );
                const activeCountry = userCountries.some(
                  (userCountry) => userCountry.id === country.id,
                );
                if (existingUserProductsIndex !== -1)
                  return (
                    <UsersProductsFormFields
                      key={country.id}
                      country={country}
                      activeCountry={!activeCountry}
                      existingUserProducts={existingUserProductsIndex !== -1}
                      product={userProducts[existingUserProductsIndex]}
                      handleChange={handleUserProductChange}
                    />
                  );
                return (
                  <UsersProductsFormFields
                    key={country.id}
                    country={country}
                    existingUserProducts={existingUserProductsIndex !== -1}
                    handleChange={handleUserProductChange}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
