import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { authOptions } from "@/lib/auth";

export async function POST() {
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
    });

    if (!cart) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart not found",
        },
        { status: 404 }
      );
    }

    cart.items = [];

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Checkout failed",
      },
      { status: 500 }
    );
  }
}