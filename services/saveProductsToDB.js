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
export const saveProductsToDB = async (date, round, force) => {
  const files = await (async () => fs.readdirSync(dataPath))();
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));

  for await (const [index, file] of productsFiles.entries()) {
    console.log(`Przetwarzam plik produktów - ${index + 1}`);
    await processFile(file).then(
      async (data) => await processProducts(convertProducts(data)),
    );
  }
  for await (const [index, file] of productsFiles.entries()) {
    console.log(`Przetwarzam plik cen - ${index + 1}`);
    await processFile(file).then(
      async (data) => await processPrices(convertProducts(data), round),
    );
  }
  for await (const [index, file] of productsFiles.entries()) {
    console.log(`Przetwarzam plik nazw - ${index + 1}`);
    await processFile(file).then(
      async (data) => await processTitles(convertProducts(data), force),
    );
  }

  await processPriceHistory(round, date);
  await processPriceChanges(date);
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
