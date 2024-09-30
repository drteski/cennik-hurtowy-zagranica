export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { variantIds, eans, skus, names } = await request.json();
  await prisma.excludeProducts.update({
    where: {
      id: 1,
    },
    data: {
      variantIds,
      eans,
      skus,
      names,
    },
  });

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
