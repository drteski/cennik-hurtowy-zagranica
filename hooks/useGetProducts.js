"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetProducts = (alias, lang, user) => {
  const getProducts = async () => {
    return await axios
      .get(`/api/products/${lang}/${alias}?user=${user}`)
      .then((res) => res.data.products)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["products", alias, lang, user],
    queryFn: getProducts,
  });
  return { data, error, isError, isLoading };
};

export default useGetProducts;
