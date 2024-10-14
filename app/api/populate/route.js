import prisma from "@/db";
import { NextResponse } from "next/server";
import { config } from "@/config/config";

export const GET = async () => {
  const data = config.data;
  const translations = config.translations;
  await Promise.all(
    data
      .map(async (item) => {
        const translationIndex = translations.findIndex(
          (translation) => translation.iso === item.iso,
        );
        const existingCountry = await prisma.country.findFirst({
          where: {
            iso: item.iso,
          },
        });
        if (!existingCountry)
          return prisma.country.create({
            data: {
              iso: item.iso,
              name: item.name,
              currency: item.currency,
              locale: item.locale,
              subject: translations[translationIndex].subject,
            },
          });
      })
      .filter(Boolean),
  );
  return new NextResponse(JSON.stringify({ message: "gotowe" }), {
    status: 200,
  });
};
