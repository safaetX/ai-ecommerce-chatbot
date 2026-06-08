import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    await Product.deleteMany({});

    const products = await Product.insertMany([
      {
        name: "Black T-Shirt",
        description: "Premium black cotton t-shirt",
        price: 799,
        category: "t-shirt",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        stock: 20,
      },
      {
        name: "White T-Shirt",
        description: "Comfortable white t-shirt",
        price: 699,
        category: "t-shirt",
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f37f4678",
        stock: 15,
      },
      {
        name: "Blue Jeans",
        description: "Classic blue denim jeans",
        price: 1499,
        category: "pants",
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d",
        stock: 12,
      },
      {
        name: "Black Pants",
        description: "Slim fit black pants",
        price: 1299,
        category: "pants",
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
        stock: 18,
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