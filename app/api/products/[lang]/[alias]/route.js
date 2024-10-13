import { NextResponse } from "next/server";
import { userProductsFilter } from "@/services/userProductsFilter";

export async function GET(request, { params }) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("user");
  const { alias, lang } = params;

  const products = await userProductsFilter(userId, lang, alias);

  return new NextResponse(JSON.stringify({ products }), {
    status: 200,
  });
}
