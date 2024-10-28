import { downloadProductsData } from "@/services/downloadProductsData";
import fs from "fs";
import { getLastDaysDate, processFile } from "@/lib/processJson";
import {
  convertProducts,
  processPriceChanges,
  processPriceHistory,
  processPrices,
  processProducts,
  processTitles,
} from "@/services/processProducts";
import prisma from "@/db";

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;
export const saveProductsToDB = async () => {
  await downloadProductsData();
  const files = fs.readdirSync(dataPath);
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));

  for await (const file of productsFiles) {
    await processFile(file).then(
      async (data) => await processProducts(convertProducts(data)),
    );
  }
  for await (const file of productsFiles) {
    await processFile(file).then(
      async (data) => await processPrices(convertProducts(data), true),
    );
  }
  for await (const file of productsFiles) {
    await processFile(file).then(
      async (data) => await processTitles(convertProducts(data)),
    );
  }

  await processPriceHistory();
  await processPriceChanges();
  await prisma.priceHistory.deleteMany({
    where: {
      createdAt: {
        lte: getLastDaysDate(30),
      },
    },
  });
  await prisma.priceChanges.deleteMany({
    where: {
      createdAt: {
        lte: getLastDaysDate(30),
      },
    },
  });
};
