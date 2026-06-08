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
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, size, quantity } = await req.json();

    let cart = await Cart.findOne({
      userId: session.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        userId: session.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item: any) =>
        item.productId.toString() === productId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        size,
        quantity,
      });
    }

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Added to cart",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add to cart",
      },
      { status: 500 }
    );
  }
}