import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const user = await prisma.product.findMany({
    where: {
      id: parseInt(params.id),
    },
    include: {
      country: true,
    },
  });
  return new NextResponse(JSON.stringify({ user }), {
    status: 200,
  });
}
