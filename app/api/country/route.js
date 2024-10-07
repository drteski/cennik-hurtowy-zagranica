import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const countries = await prisma.country.findMany();
  return new NextResponse(
    JSON.stringify({
      countries,
    }),
    {
      status: 200,
    },
  );
}
