import { downloadProductsData } from "@/services/downloadProductsData";
import {
  convertProducts,
  processPrices,
  processProducts,
  processTitles,
} from "@/services/processProducts";
import { NextResponse } from "next/server";
import fs from "fs";
import { processFile } from "@/lib/processJson";

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;

export async function GET() {
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

  // await prisma.product.deleteMany();
  // await prisma.productName.deleteMany();
  // await prisma.productPrice.deleteMany();

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
