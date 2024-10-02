export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";
import { config } from "../../../config/config";

export async function GET(request) {
  const { data, translations } = config;

  const populate = data.reduce((prev, curr) => {
    const index = translations.findIndex(
      (translation) => translation.iso === curr.iso,
    );
    return [
      ...prev,
      {
        ...curr,
        subject: translations[index].subject,
      },
    ];
  }, []);
  await Promise.all(
    populate.map(async (pop) => {
      const { iso, password, name, currency, locale, subject } = pop;
      const existingCountry = await prisma.country.findFirst({
        where: { iso },
      });
      if (existingCountry) return;
      return prisma.country.create({
        data: {
          iso,
          password,
          name,
          currency,
          locale,
          mailingList: {
            create: {
              subject,
            },
          },
          excludeProducts: {
            create: {
              activeVariants: false,
              activeProducts: false,
            },
          },
        },
      });
    }),
  );
  return NextResponse.json({ message: "poszło" });
}
