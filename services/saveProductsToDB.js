import { downloadProductsData } from "@/services/downloadProductsData";
import fs from "fs";
import { processFile } from "@/lib/processJson";
import {
  convertProducts,
  processPrices,
  processProducts,
  processTitles,
} from "@/services/processProducts";

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
      async (data) => await processPrices(convertProducts(data)),
    );
  }
  for await (const file of productsFiles) {
    await processFile(file).then(
      async (data) => await processTitles(convertProducts(data)),
    );
  }
};
