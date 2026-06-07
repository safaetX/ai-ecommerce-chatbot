import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error: any) {
  console.error("MongoDB Error:", error);

  return NextResponse.json(
    {
      success: false,
      error: error.message,
    },
    { status: 500 }
  );
}
}