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
      userProducts: {
        where: {
          country: {
            some: {
              iso: params.lang,
            },
          },
        },
      },
      country: {
        where: {
          iso: params.lang,
        },
      },
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
    .filter(
      (product) => !user.userProducts[0].ids.some((id) => id === product.id),
    )
    // .filter(
    //   (product) =>
    //     !user.userProducts[0].variantIds.some((id) => id === product.variantId),
    // )
    // .filter(
    //   (product) =>
    //     !user.userProducts[0].skus.some(
    //       (sku) => sku.toLowerCase() === product.sku.toLowerCase(),
    //     ),
    // )
    // .filter(
    //   (product) =>
    //     !user.userProducts[0].eans.some((ean) => ean === product.ean),
    // )
    // .filter(
    //   (product) =>
    //     !user.userProducts[0].names.some((name) =>
    //       product.names[0].name.toLowerCase().includes(name.toLowerCase()),
    //     ),
    // )
    // .filter((product) =>
    //   user.userProducts[0].onlyWithSku ? product.sku !== "" : true,
    // )
    // .filter((product) =>
    //   user.userProducts[0].activeVariants ? product.activeVariant : false,
    // )
    // .filter((product) =>
    //   user.userProducts[0].activeProducts ? product.active : false,
    // )
    .map((product) => {
      const { brand, ean, id, names, prices, sku, variantId } = product;

      if (names.length === 0 || prices.length === 0) {
        return {
          id,
          variantId,
          ean,
          sku,
          brand,
          name: "",
          price: {
            lang: params.lang,
            currency: user.country[0].currency,
            newPrice: 0,
            oldPrice: 0,
            difference: 0,
          },
        };
      }
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
