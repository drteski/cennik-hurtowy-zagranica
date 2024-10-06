"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetCountries = () => {
  const getCountries = async () => {
    return await axios
      .get(`/api/country`)
      .then((res) => res.data.countries)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["country"],
    queryFn: getCountries,
  });
  return { data, error, isError, isLoading };
};

export default useGetCountries;
