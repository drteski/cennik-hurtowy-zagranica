"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetPriceHistory = () => {
  const getPriceHistory = async () => {
    return await axios
      .get(`/api/products/history`)
      .then((res) => res.data.priceHistory)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["priceHistory"],
    queryFn: getPriceHistory,
  });
  return { data, error, isError, isLoading };
};

export default useGetPriceHistory;
