import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Use /api/checkout/create-order-and-intent",
    },
    { status: 410 }
  );
}
