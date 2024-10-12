import { notifyClient } from "@/services/sendNotification";
import { NextResponse } from "next/server";

export async function GET() {
  await notifyClient();
  return NextResponse.json({ messageSentTo: "poszło" });
}
