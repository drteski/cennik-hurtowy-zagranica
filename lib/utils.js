import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import prisma from "@/db";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const matchPath = async (lang) => {
  const country = await prisma.country.findMany({
    where: {
      iso: lang,
    },
  });
  return country.length !== 0;
};
