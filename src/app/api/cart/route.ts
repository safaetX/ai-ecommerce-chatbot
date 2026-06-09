import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({
      userId: (session.user as any).id,
    }).populate("items.productId");

    return NextResponse.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
      },
      { status: 500 }
    );
  }
}