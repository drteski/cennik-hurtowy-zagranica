import prisma from "@/db";

export const userProductsFilter = async (
  userId,
  userLang,
  userAlias = "",
  onlyDifferences = false,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId),
    },
    include: {
      userProducts: {
        where: {
          country: {
            some: {
              iso: userLang,
            },
          },
        },
      },
      country: {
        where: {
          iso: userLang,
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
  });
  console.log(products);
  const selectedProducts = products
    .filter((product) => {
      if (userAlias === "") return true;
      if (userAlias === "rea") return product.brand === "Rea";
      if (userAlias === "tutumi")
        return (
          product.brand === "Tutumi" ||
          product.brand === "FlexiFit" ||
          product.brand === "Bluegarden" ||
          product.brand === "PuppyJoy" ||
          product.brand === "Kigu" ||
          product.brand === "Fluffy Glow"
        );
      if (userAlias === "toolight")
        return product.brand === "Toolight" || product.brand === "Spectrum LED";
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
            lang: userLang,
            currency: user.country[0].currency,
            newPrice: 0,
            oldPrice: 0,
            difference: 0,
          },
        };
      }
      const filterPrices = product.prices.filter(
        (price) => price.lang === userLang,
      );
      const filterNames = product.names.filter(
        (name) => name.lang === userLang,
      );

      return {
        id: `${id}`,
        variantId: `${variantId}`,
        ean,
        sku,
        brand,
        name: filterNames[0].name,
        price: {
          ...filterPrices[0],
          difference: filterPrices[0].oldPrice - filterPrices[0].newPrice,
        },
      };
    });
  console.log(selectedProducts);
  if (onlyDifferences) {
    return selectedProducts.filter((product) => product.price.difference !== 0);
  } else {
    return selectedProducts;
  }
};
