import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const country = await prisma.country.findFirst({
    where: {
      id: parseInt(params.id),
    },
  });
  return new NextResponse(JSON.stringify({ country }), {
    status: 200,
  });
}

export async function POST(request, { params }) {
  const { iso, name, currency, locale, subject } = await request.json();
  const country = await prisma.country.update({
    where: {
      id: parseInt(params.id),
    },
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
