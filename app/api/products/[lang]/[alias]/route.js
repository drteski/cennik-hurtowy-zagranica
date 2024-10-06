import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user");
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    include: {
      userProducts: true,
    },
  });
  const products = await prisma.product.findMany({
    where: {},
    include: {
      names: {
        where: {
          lang: params.lang,
        },
      },
      prices: {
        where: {
          lang: params.lang,
        },
      },
    },
  });
  const selectedProducts = products
    .filter((product) =>
      product.alias.some((alias) => alias.toLowerCase() === params.alias),
    )
    .map((product) => {
      const { brand, ean, id, names, prices, sku, variantId } = product;

      return {
        id,
        variantId,
        ean,
        sku,
        brand,
        name: names[0].name,
        price: {
          ...prices[0],
          difference: prices[0].oldPrice - prices[0].newPrice,
        },
      };
    });

  return new NextResponse(JSON.stringify({ products: selectedProducts }), {
    status: 200,
  });
}
