import { NextResponse } from "next/server";
import { downloadProductsData } from "@/services/downloadProductsData";

export async function GET() {
  await downloadProductsData();
  return NextResponse.json({ message: "Pominięto" });
}
