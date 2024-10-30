import { NextResponse } from "next/server";
import prisma from "@/db";
import { isToday } from "date-fns";
import { saveProductsToDB } from "@/services/saveProductsToDB";
import { deleteAllData } from "@/services/processProducts";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const force = searchParams.get("force") === "true";
  const queryDate = searchParams.get("date");
  const round = searchParams.get("round") === "true";
  const deleteData = searchParams.get("delete") === "true";
  let date = null;
  if (queryDate) {
    const splitedDate = queryDate.split("-");
    const year = parseInt(splitedDate[2]);
    const month = parseInt(splitedDate[1]) - 1;
    const day = parseInt(splitedDate[0]);
    date = new Date(year, month, day);
  }
  if (deleteData) {
    await deleteAllData();
    return NextResponse.json({ message: "Usunięto wszystko" });
  }

  const checkUpdated = await prisma.product.findFirst();
  const today = force
    ? true
    : checkUpdated
      ? !isToday(new Date(checkUpdated.updatedAt))
      : true;
  if (today) {
    saveProductsToDB(date, round, force);
    return NextResponse.json({ message: "Zakolejkowano aktualizację" });
  }

  return NextResponse.json({ message: "Pominięto" });
}
