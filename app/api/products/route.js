import { NextResponse } from "next/server";

import { saveProductsToDB } from "@/services/saveProductsToDB";

export async function GET(request) {
  const saved = await saveProductsToDB().then((res) => res);
  return NextResponse.json({ message: saved });
}
