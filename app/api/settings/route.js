export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request) {
  const { pass, lang } = await request.json();
  const country = await prisma.country.findFirst({
    where: {
      iso: lang,
    },
  });
  const authorized = country.password === pass;
  return NextResponse.json({ authorized });
}
