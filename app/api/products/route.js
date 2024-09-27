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
const processProducts = async (data) => {
  const products = data
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

  return products.map(async (product) => {
    const { variantId, sku, ean, brand, titles, prices } = product;
    await prisma.product.upsert({
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
    await Promise.all(
      titles.map(async (title) => {
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
              lang: title.lang,
              name: title.value,
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
              lang: title.lang,
              name: title.value,
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
    await Promise.all(
      prices.map(async (price) => {
        const existingPrice = await prisma.productPrice.findFirst({
          where: {
            lang: price.lang,
            productId: variantId,
          },
        });
        if (existingPrice) {
          return prisma.productPrice.update({
            where: {
              id: existingPrice.id,
            },
            data: {
              lang: price.lang,
              currency: price.currency,
              oldPrice: existingPrice.newPrice,
              newPrice: price.price,
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
              lang: price.lang,
              currency: price.currency,
              oldPrice: price.price,
              newPrice: price.price,
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
  });
};

export async function GET() {
  const files = fs.readdirSync(dataPath);
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));

  await Promise.all(
    productsFiles.map(async (file) => await processFile(file, processProducts)),
  );

  // await prisma.product.deleteMany({});
  // await prisma.productName.deleteMany({});
  // await prisma.productPrice.deleteMany({});
  // const filesToDelete = files.map(
  //   async (file) =>
  //     await fs.unlink(`${dataPath}${file}`, (err) => console.log(err)),
  // );
  // await Promise.all(filesToDelete);

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
