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
  const userProductExclusions = user.userProducts[0];
  const products = await prisma.product.findMany({
    where: {
      ...(userProductExclusions.onlyWithSku
        ? {
            sku: {
              not: "",
            },
          }
        : {}),
      ...(userProductExclusions.activeVariants
        ? {
            activeVariant: true,
          }
        : {}),
      ...(userProductExclusions.activeProducts
        ? {
            active: true,
          }
        : {}),
      NOT: {
        OR: [
          {
            id: {
              in: userProductExclusions.ids,
            },
          },
          {
            variantId: {
              in: userProductExclusions.variantIds,
            },
          },
          {
            sku: {
              in: userProductExclusions.skus,
            },
          },
          {
            ean: {
              in: userProductExclusions.eans,
            },
          },
        ],
      },
    },
    include: {
      names: {
        where: {
          lang: params.lang,
        },
      },
      prices: {
        where: {
          lang: params.lang,
          NOT: {
            OR: [
              {
                newPrice: 0,
              },
              {
                oldPrice: 0,
              },
            ],
          },
        },
      },
    },
  });
  const selectedProducts = products
    .filter((product) => {
      if (params.alias === "rea") {
        return product.brand === "Rea";
      }
      if (params.alias === "tutumi") {
        return (
          product.brand === "Tutumi" ||
          product.brand === "FlexiFit" ||
          product.brand === "Bluegarden" ||
          product.brand === "PuppyJoy" ||
          product.brand === "Kigu" ||
          product.brand === "Fluffy Glow"
        );
      }
      if (params.alias === "toolight") {
        return product.brand === "Toolight" || product.brand === "Spectrum LED";
      }
    })
    .filter((product) => product.prices.length !== 0)
    .filter(
      (product) =>
        !userProductExclusions.names.some((name) =>
          product.names[0].name.toLowerCase().includes(name.toLowerCase()),
        ),
    )
    .map((product) => {
      const { brand, ean, id, names, prices, sku, variantId } = product;

      if (names.length === 0 || prices.length === 0) {
        return {
          id: `${id}`,
          variantId: `${variantId}`,
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
        id: `${id}`,
        variantId: `${variantId}`,
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
