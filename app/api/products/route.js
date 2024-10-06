export const dynamic = "force-dynamic";
import { format } from "date-fns";
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
  const files = fs.readdirSync(dataPath);
  const productsFiles = files.filter((file) => file.match(/product-\d*/g));
  const start = format(new Date(), "pp");

  for await (const file of productsFiles) {
    const products = await processFile(file).then((data) =>
      convertProducts(data),
    );
    await processProducts(products);
    await processPrices(products);
    await processTitles(products);
  }
  const timestamp =
    "Start :" + start + "\n" + "End: " + format(new Date(), "pp");

  fs.writeFileSync("./public/log.txt", timestamp, "utf8");

  // await prisma.product.deleteMany();
  // await prisma.productName.deleteMany();
  // await prisma.productPrice.deleteMany();

  return NextResponse.json({ message: "Zaktualizowano produkty." });
}
