export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request) {
  const { id, password } = await request.json();
  const passUpdate = await prisma.country.update({
    where: {
      id: parseInt(id),
    },
    data: {
      password,
    },
  });
  return NextResponse.json({ passUpdate });
}
