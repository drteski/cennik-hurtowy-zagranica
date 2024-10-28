import { NextResponse } from "next/server";
import { endOfDay, startOfDay } from "date-fns";
import { getLastDaysDate } from "@/lib/processJson";
import prisma from "@/db";

export async function GET() {
  const priceChanges = await prisma.priceChanges.findMany({
    where: {
      createdAt: {
        lte: endOfDay(new Date()),
        gte: startOfDay(getLastDaysDate(10)),
      },
    },
    include: {
      country: true,
    },
  });

  return new NextResponse(JSON.stringify({ priceChanges }), {
    status: 200,
  });
}
