import { NextResponse } from "next/server";
import prisma from "@/db";
import { isToday } from "date-fns";
import { saveProductsToDB } from "@/services/saveProductsToDB";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const force = searchParams.get("force") === "true";

  const checkUpdated = await prisma.product.findFirst();
  const today = force
    ? true
    : checkUpdated
      ? !isToday(new Date(checkUpdated.updatedAt))
      : true;
  if (today) {
    saveProductsToDB();
    return NextResponse.json({ message: "Zakolejkowano aktualizację" });
  }

  return NextResponse.json({ message: "Pominięto" });
}
