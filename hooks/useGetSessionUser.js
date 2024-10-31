"use client";

import { useMemo } from "react";

export const useGetSessionUser = (isLoading, data, session) => {
  return useMemo(() => {
    if (!isLoading) {
      if (session.data !== undefined)
        if (session.data.user !== undefined)
          return data.filter((user) => user.id === session.data.user.id)[0];
      return {};
    }
    return {};
  }, [data, isLoading, session.data]);
};
