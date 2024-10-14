import prisma from "@/db";
import { NextResponse } from "next/server";
import { config } from "@/config/config";

export const GET = async () => {
  const data = config.data;
  const translations = config.translations;
  await Promise.all(
    data.map(async (item) => {
      const translationIndex = translations.findIndex(
        (translation) => translation.iso === item.iso,
      );
      return prisma.country.create({
        data: {
          iso: item.iso,
          name: item.name,
          currency: item.currency,
          locale: item.locale,
          subject: translations[translationIndex].subject,
        },
      });
    }),
  );
  return new NextResponse(JSON.stringify({ message: "gotowe" }), {
    status: 200,
  });
};
