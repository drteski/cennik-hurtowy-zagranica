"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetCountry = (id) => {
  const getCountry = async () => {
    return await axios
      .get(`/api/country/${id}`)
      .then((res) => res.data.country)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["country", id],
    queryFn: getCountry,
  });
  return { data, error, isError, isLoading };
};

export default useGetCountry;
