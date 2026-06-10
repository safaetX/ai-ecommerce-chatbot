import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

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

    await Product.deleteMany({});

    const products = await Product.insertMany([
      {
        name: "Black T-Shirt",
        description: "Premium black cotton t-shirt",
        price: 799,
        category: "t-shirt",
        image:
          "/products/black-tshirt.jpg",
        stock: {
          S: 3,
          M: 5,
          L: 6,
          XL: 4,
          XXL: 2,
        },
      },
      {
        name: "White T-Shirt",
        description: "Comfortable white t-shirt",
        price: 699,
        category: "t-shirt",
        image:
          "/products/white-tshirt.jpg",
        stock: {
          S: 2,
          M: 4,
          L: 5,
          XL: 3,
          XXL: 1,
        },
      },
      {
        name: "Blue Jeans",
        description: "Classic blue denim jeans",
        price: 1499,
        category: "pants",
        image:
          "/products/blue-jeans.jpg",
        stock: {
          S: 1,
          M: 3,
          L: 4,
          XL: 2,
          XXL: 1,
        },
      },
      {
        name: "Black Pants",
        description: "Slim fit black pants",
        price: 1299,
        category: "pants",
        image:
          "/products/black-pants.jpg",
        stock: {
          S: 2,
          M: 4,
          L: 5,
          XL: 4,
          XXL: 2,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      count: products.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed products",
      },
      { status: 500 }
    );
  }
}