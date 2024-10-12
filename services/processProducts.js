import { mapBrands, mapPrices, mapTitles } from "@/lib/processJson";
import prisma from "@/db";
import { config } from "@/config/config";

export const convertProducts = (data) => {
  return data
    .map((product) => {
      const productVariant =
        product.variants.variant.length >= 0
          ? product.variants.variant
          : [product.variants.variant];

      let aliases = [];
      if (typeof product.aliases === "string") {
        aliases = product.aliases
          .split(";")
          .map((alias) => {
            const index = config.alias.findIndex((al) => al.id === alias);
            if (index !== -1) return config.alias[index].name;
          })
          .filter(Boolean);
      }

      return productVariant.map((variant) => {
        return {
          uid: parseInt(`${product.$id}${variant.$id}`),
          id: parseInt(product.$id),
          active: product.$active === "true",
          activeVariant: variant.$isActive === "true",
          aliases,
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
    .filter(Boolean);
};
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
        } = product;
        return prisma.product.upsert({
          where: {
            uid,
          },
          update: {
            uid,
            active,
            id,
            activeVariant,
            variantId,
            alias: aliases,
            sku,
            ean,
            brand,
          },
          create: {
            uid,
            active,
            id,
            activeVariant,
            variantId,
            alias: aliases,
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
      const { uid, prices } = product;
      pricesToSave.push(
        ...prices.map((price) => ({
          uid,
          lang: price.lang,
          currency: price.currency,
          price: price.price,
        })),
      );
    });
    await Promise.all(
      pricesToSave
        .map(async (prices) => {
          const { uid, lang, currency, price } = prices;
          const existingPrice = await prisma.productPrice.findFirst({
            where: {
              lang: lang,
              productId: uid,
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
                    uid,
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
                    uid,
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
      const { uid, titles } = product;
      titlesToSave.push(
        ...titles.map((title) => ({
          uid,
          lang: title.lang,
          name: title.value,
        })),
      );
    });
    await Promise.all(
      titlesToSave
        .map(async (title) => {
          const { uid, lang, name } = title;
          const existingTitle = await prisma.productName.findFirst({
            where: {
              lang: title.lang,
              productId: uid,
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
                      uid,
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
                    uid,
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
