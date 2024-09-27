export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import fs from "fs";
import prisma from "@/db";
import {
  mapBrands,
  mapPrices,
  mapTitles,
  processFile,
} from "@/lib/processJson";

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;

const convertProducts = (data) => {
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
    .filter(Boolean);
};
const processProducts = async (data) => {
  return new Promise(async (resolve, reject) => {
    await Promise.all(
      data.map(async (product) => {
        const { variantId, sku, ean, brand, titles, prices } = product;
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

const processPrices = async (data) => {
  return new Promise(async (resolve, reject) => {
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
      pricesToSave.map(async (prices) => {
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
      }),
    );
    resolve();
  });
};
const processTitles = async (data) => {
  return new Promise(async (resolve, reject) => {
    const titlesToSave = [];
    data.forEach((product) => {
      const { variantId, titles } = product;
      titlesToSave.push(
        ...titles.map((title) => ({
          variantId,
          lang: title.lang,
          name: title.name,
        })),
      );
    });
    await Promise.all(
      titlesToSave.map(async (title) => {
        const { variantId, lang, name } = title;
        const existingTitle = await prisma.productName.findFirst({
          where: {
            lang: title.lang,
            productId: variantId,
          },
        });
        if (existingTitle) {
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
      }),
    );
    resolve();
  });
};

export async function GET() {
  const files = fs.readdirSync(dataPath);
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));

  for await (const file of productsFiles) {
    const products = await processFile(file).then((data) =>
      convertProducts(data),
    );
    await processProducts(products);
    await processPrices(products);
    await processTitles(products);
  }

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
