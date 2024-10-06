"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetUsers = () => {
  const getUsers = async () => {
    return await axios
      .get(`/api/users`)
      .then((res) => res.data.users)
      .catch((error) => ({
        message: error,
      }));
  };
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return { data, error, isError, isLoading };
};

export default useGetUsers;
