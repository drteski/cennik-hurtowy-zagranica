"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetUser = (id) => {
  const getUser = async () => {
    return await axios
      .get(`/api/users/${id}`)
      .then((res) => res.data.user)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: getUser,
  });
  return { data, error, isError, isLoading };
};

export default useGetUser;
