import { NextResponse } from "next/server";
import { endOfDay, startOfDay } from "date-fns";
import { getLastDaysDate } from "@/lib/processJson";
import prisma from "@/db";

export async function GET() {
  const priceHistory = await prisma.priceHistory.findMany({
    where: {
      createdAt: {
        lte: endOfDay(new Date()),
        gte: startOfDay(getLastDaysDate(10)),
      },
    },
    include: {
      country: true,
      product: {
        include: {
          names: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify({ priceHistory }), {
    status: 200,
  });
}
