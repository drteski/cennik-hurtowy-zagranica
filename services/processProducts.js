import { mapBrands, mapPrices, mapTitles } from "@/lib/processJson";
import prisma from "@/db";

export const convertProducts = (data) => {
  return data
    .map((product) => {
      const productVariant =
        product.variants.variant.length >= 0
          ? product.variants.variant
          : [product.variants.variant];
      return productVariant.map((variant) => {
        if (variant.$isActive === "true")
          if (variant.$symbol !== "")
            return {
              variantId: parseInt(variant.$id),
              sku: variant.$symbol,
              ean: variant.$ean,
              brand: mapBrands(product.$producer),
              titles: mapTitles(product.titles.title),
              prices: mapPrices(variant.basePrice),
            };
      });
    })
    .flatMap((product) => product)
    .filter(Boolean)
    .filter((product) => {
      const { titles } = product;
      return !titles.some((title) =>
        title.value.toLowerCase().includes("allegro"),
      );
    });
};
export const processProducts = async (data) => {
  return new Promise(async (resolve) => {
    await Promise.all(
      data.map(async (product) => {
        const { variantId, sku, ean, brand } = product;
        return prisma.product.upsert({
          where: {
            id: variantId,
          },
          update: {
            id: variantId,
            sku,
            ean,
            brand,
          },
          create: {
            id: variantId,
            sku,
            ean,
            brand,
          },
        });
      }),
    );
    resolve();
  });
};
export const processPrices = async (data) => {
  return new Promise(async (resolve) => {
    const pricesToSave = [];
    data.forEach((product) => {
      const { variantId, prices } = product;
      pricesToSave.push(
        ...prices.map((price) => ({
          variantId,
          lang: price.lang,
          currency: price.currency,
          price: price.price,
        })),
      );
    });
    await Promise.all(
      pricesToSave
        .map(async (prices) => {
          const { variantId, lang, currency, price } = prices;
          const existingPrice = await prisma.productPrice.findFirst({
            where: {
              lang: lang,
              productId: variantId,
            },
          });
          if (existingPrice) {
            return prisma.productPrice.update({
              where: {
                id: existingPrice.id,
              },
              data: {
                lang: lang,
                currency: currency,
                oldPrice: existingPrice.newPrice,
                newPrice: price,
                product: {
                  connect: {
                    id: variantId,
                  },
                },
              },
            });
          } else {
            return prisma.productPrice.create({
              data: {
                lang: lang,
                currency: currency,
                oldPrice: price,
                newPrice: price,
                product: {
                  connect: {
                    id: variantId,
                  },
                },
              },
            });
          }
        })
        .filter(Boolean),
    );
    resolve();
  });
};
export const processTitles = async (data) => {
  return new Promise(async (resolve) => {
    const titlesToSave = [];
    data.forEach((product) => {
      const { variantId, titles } = product;
      titlesToSave.push(
        ...titles.map((title) => ({
          variantId,
          lang: title.lang,
          name: title.value,
        })),
      );
    });
    await Promise.all(
      titlesToSave
        .map(async (title) => {
          const { variantId, lang, name } = title;
          const existingTitle = await prisma.productName.findFirst({
            where: {
              lang: title.lang,
              productId: variantId,
            },
          });
          if (existingTitle) {
            if (existingTitle.name !== name) {
              return prisma.productName.update({
                where: {
                  id: existingTitle.id,
                },
                data: {
                  lang,
                  name,
                  product: {
                    connect: {
                      id: variantId,
                    },
                  },
                },
              });
            }
          } else {
            return prisma.productName.create({
              data: {
                lang,
                name,
                product: {
                  connect: {
                    id: variantId,
                  },
                },
              },
            });
          }
        })
        .filter(Boolean),
    );
    resolve();
  });
};
