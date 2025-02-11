import prisma from "@/db";

export const processProducts = async (data) => {
  return new Promise(async (resolve) => {
    await Promise.all(
      data.map(async (product) => {
        const {
          uid,
          id,
          active,
          activeVariant,
          variantId,
          aliases,
          sku,
          ean,
          brand,
          names,
          prices,
        } = product;

        const convertedPrices = prices.map((price) => {
          return {
            lang: price.lang,
            currency: price.currency,
            oldPrice: Math.round(price.price),
            newPrice: Math.round(price.price),
          };
        });

        const existingProduct = await prisma.product.findFirst({
          where: {
            uid,
          },
        });
        if (existingProduct) {
          const newPrices = convertedPrices.map((price) => {
            const existingPrices = existingProduct.prices.filter(
              (existing) => existing.lang === price.lang,
            );

            return {
              lang: price.lang,
              currency: price.currency,
              oldPrice: existingPrices[0].newPrice,
              newPrice: price.newPrice,
            };
          });
          return prisma.product.update({
            where: {
              uid: existingProduct.uid,
            },
            data: {
              uid,
              active,
              id,
              activeVariant,
              variantId,
              alias: aliases,
              sku,
              ean,
              names,
              prices: newPrices,
              brand,
            },
          });
        } else {
          return prisma.product.create({
            data: {
              uid,
              active,
              id,
              activeVariant,
              variantId,
              alias: aliases,
              sku,
              ean,
              names,
              prices: convertedPrices,
              brand,
            },
          });
        }
      }),
    );
    resolve();
  });
};

export const processPriceHistory = async () => {
  return new Promise(async (resolve) => {
    const countries = await prisma.country.findMany();
    const products = await prisma.product.findMany();
    const productsWithChanges = products
      .map((product) => {
        const pricesWithChanges = product.prices.filter(
          (price) => price.oldPrice !== price.newPrice,
        );
        if (pricesWithChanges.length !== 0)
          return { ...product, prices: pricesWithChanges };
      })
      .filter(Boolean);
    if (productsWithChanges.length !== 0) {
      await Promise.all(
        productsWithChanges.map((product) => {
          return product.prices.map(async (price) => {
            const country = countries.filter(
              (country) => country.iso === price.lang,
            );
            const existingPriceHistory = await prisma.priceHistory.findFirst({
              where: {
                countryId: country[0].id,
                productId: product.uid,
              },
            });
            if (!existingPriceHistory) {
              await prisma.priceHistory.create({
                data: {
                  country: {
                    connect: {
                      id: country[0].id,
                    },
                  },
                  oldPrice: Math.round(price.oldPrice),
                  newPrice: Math.round(price.newPrice),
                  product: {
                    connect: {
                      uid: product.uid,
                    },
                  },
                },
              });
            } else {
              await prisma.priceHistory.update({
                where: {
                  id: existingPriceHistory.id,
                },
                data: {
                  oldPrice: Math.round(price.oldPrice),
                  newPrice: Math.round(price.newPrice),
                  createdAt: new Date(Date.now()),
                },
              });
            }
          });
        }),
      );
    }
    resolve();
  });
};
