import { mapBrands, mapPrices, mapTitles } from "@/lib/processJson";
import prisma from "@/db";
import { config } from "@/config/config";
import { endOfDay, isToday, startOfDay } from "date-fns";

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
export const processPrices = async (data, roundPrices) => {
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
            if (
              existingPrice.newPrice !== roundPrices ? Math.round(price) : price
            )
              return prisma.productPrice.update({
                where: {
                  id: existingPrice.id,
                },
                data: {
                  lang: lang,
                  currency: currency,
                  oldPrice: existingPrice.newPrice,
                  newPrice: roundPrices ? Math.round(price) : price,
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
                oldPrice: roundPrices ? Math.round(price) : price,
                newPrice: roundPrices ? Math.round(price) : price,
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
export const processTitles = async (data, force) => {
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
            if (force) {
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

export const processPriceHistory = async (roundPrices, date) => {
  return new Promise(async (resolve) => {
    const countries = await prisma.country.findMany();
    if (countries.length !== 0) {
      await Promise.all(
        countries.map(async (country) => {
          const { iso } = country;
          const productPrices = await prisma.productPrice.findMany({
            where: {
              lang: iso,
            },
          });
          return Promise.all(
            productPrices
              .filter((price) => price.oldPrice !== price.newPrice)
              .map(async (price) => {
                const { productId, newPrice, oldPrice } = price;
                const existingPriceHistory = await prisma.priceHistory.findMany(
                  {
                    where: {
                      countryId: country.id,
                      productId: productId,
                    },
                  },
                );
                if (existingPriceHistory.length === 0) {
                  return prisma.priceHistory.create({
                    data: {
                      country: {
                        connect: {
                          id: country.id,
                        },
                      },
                      oldPrice: roundPrices ? Math.round(oldPrice) : oldPrice,
                      newPrice: roundPrices ? Math.round(newPrice) : newPrice,
                      product: {
                        connect: {
                          uid: productId,
                        },
                      },
                    },
                  });
                } else {
                  return Promise.all(
                    existingPriceHistory.map(async (existing) => {
                      const { createdAt } = existing;
                      if (isToday(date ? date : createdAt)) {
                        if (
                          existing.newPrice !== newPrice ||
                          existing.oldPrice !== oldPrice
                        ) {
                          return prisma.priceHistory.update({
                            where: {
                              id: existing.id,
                            },
                            data: {
                              oldPrice: roundPrices
                                ? Math.round(oldPrice)
                                : oldPrice,
                              newPrice: roundPrices
                                ? Math.round(newPrice)
                                : newPrice,
                            },
                          });
                        }
                      } else {
                        return prisma.priceHistory.create({
                          data: {
                            country: {
                              connect: {
                                id: country.id,
                              },
                            },
                            oldPrice: roundPrices
                              ? Math.round(oldPrice)
                              : oldPrice,
                            newPrice: roundPrices
                              ? Math.round(newPrice)
                              : newPrice,
                            product: {
                              connect: {
                                uid: productId,
                              },
                            },
                          },
                        });
                      }
                    }),
                  );
                }
              })
              .filter(Boolean),
          );
        }),
      );
    }
    resolve();
  });
};
export const processPriceChanges = async (date) => {
  return new Promise(async (resolve) => {
    const countries = await prisma.country.findMany();
    if (countries.length !== 0) {
      await Promise.all(
        countries
          .map(async (country) => {
            const { iso } = country;
            const productPrices = await prisma.productPrice.findMany({
              where: {
                lang: iso,
              },
            });

            const priceChanges = productPrices
              .filter((price) => price.oldPrice !== price.newPrice)
              .map((price) => {
                return {
                  difference: price.oldPrice - price.newPrice,
                };
              })
              .reduce(
                (previousValue, currentValue) => {
                  if (currentValue.difference > 0) previousValue.priceDown++;
                  if (currentValue.difference < 0) previousValue.priceUp++;
                  return previousValue;
                },
                {
                  priceUp: 0,
                  priceDown: 0,
                },
              );
            const existingPriceChanges = await prisma.priceChanges.findFirst({
              where: {
                countryId: country.id,
                createdAt: {
                  lte: endOfDay(date ? date : new Date()),
                  gte: startOfDay(date ? date : new Date()),
                },
              },
            });
            if (!existingPriceChanges) {
              return prisma.priceChanges.create({
                data: {
                  pricesUp: priceChanges.priceUp,
                  pricesDown: priceChanges.priceDown,
                  country: {
                    connect: {
                      id: country.id,
                    },
                  },
                },
              });
            } else {
              return prisma.priceChanges.update({
                where: {
                  id: existingPriceChanges.id,
                },
                data: {
                  pricesUp: priceChanges.priceUp,
                  pricesDown: priceChanges.priceDown,
                  country: {
                    connect: {
                      id: country.id,
                    },
                  },
                },
              });
            }
          })
          .filter(Boolean),
      );
    }
    resolve();
  });
};

export const deleteAllData = async () => {
  return new Promise(async (resolve) => {
    await prisma.product.deleteMany();
    await prisma.productName.deleteMany();
    await prisma.productPrice.deleteMany();
    await prisma.priceHistory.deleteMany();
    await prisma.priceChanges.deleteMany();
    resolve();
  });
};
