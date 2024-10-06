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

export async function PUT(request) {
  const { iso, name, currency, locale, subject } = await request.json();
  const country = await prisma.country.create({
    data: {
      iso,
      name,
      currency,
      locale,
      subject,
    },
  });
  return new NextResponse(JSON.stringify({ country }), {
    status: 200,
  });
}
