export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import prisma from "@/db";

export async function POST(request) {
  const { id, subject, emails } = await request.json();
  await prisma.mailingList.update({
    where: {
      id: parseInt(id),
    },
    data: {
      subject,
      emails,
    },
  });

  return NextResponse.json({});
}
