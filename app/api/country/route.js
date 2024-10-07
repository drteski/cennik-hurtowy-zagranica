import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const countries = await prisma.country.findMany();
  return new NextResponse(
    JSON.stringify({ countries: countries.sort((a, b) => a.id - b.id) }),
    {
      status: 200,
    },
  );
}
