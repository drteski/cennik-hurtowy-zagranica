"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetPriceChanges = () => {
  const getPriceChanges = async () => {
    return await axios
      .get(`/api/products/changes`)
      .then((res) => res.data.priceChanges)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["priceChanges"],
    queryFn: getPriceChanges,
  });
  return { data, error, isError, isLoading };
};

export default useGetPriceChanges;
