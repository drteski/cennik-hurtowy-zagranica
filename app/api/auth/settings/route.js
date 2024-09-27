export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request) {
  const { pass } = await request.json();
  const settings = await prisma.settings.findFirst({
    where: {
      id: 1,
    },
  });
  const authorized = settings.password === pass;
  return NextResponse.json({ authorized });
}

export async function PUT(request) {
  const { pass } = await request.json();
  const settings = await prisma.settings.update({
    where: {
      id: 1,
    },
    data: {
      password: pass,
    },
  });
  return NextResponse.json({ settings });
}
