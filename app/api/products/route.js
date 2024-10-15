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
import prisma from "@/db";
import { differenceInHours } from "date-fns";

const dataPath = `${process.cwd().replace(/\\\\/g, "/")}/public/temp/data/`;

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const force = searchParams.get("force") === "true";

  const checkUpdated = await prisma.product.findFirst();
  const hours = force
    ? 24
    : differenceInHours(
        new Date(2024, 9, 20),
        new Date(checkUpdated.updatedAt),
      );
  if (hours >= 20) {
    NextResponse.json({ message: "Zaktualizowano produkty." });
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
    return;
  }

  return NextResponse.json({ message: "Pominięto." });
}
