import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {},
    include: {
      country: true,
      userProducts: true,
    },
  });
  return new NextResponse(JSON.stringify({ users }), {
    status: 200,
  });
}
