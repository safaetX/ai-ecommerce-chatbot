import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
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

    const { productId, size, quantity } = await req.json();

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

    const item = cart.items.find(
      (item: any) =>
        item.productId.toString() === productId &&
        item.size === size
    );

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
        },
        { status: 404 }
      );
    }

    item.quantity = Math.max(1, quantity);

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Quantity updated",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update quantity",
      },
      { status: 500 }
    );
  }
}