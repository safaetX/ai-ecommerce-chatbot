import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Cart from "@/models/Cart";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    await connectDB();

    const products = await Product.find();

    const productList = products
    .map(
        (p) =>
        `${p.name} (৳${p.price}) - Category: ${p.category}`
    )
    .join("\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are an AI shopping assistant.

Available products:

${productList}

Analyze the user's message and determine the intent.

Possible intents:
- recommend
- add_to_cart
- remove_from_cart
- checkout

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in \`\`\`.
Do not include explanations.

JSON format:

{
  "intent": "recommend",
  "product": null,
  "size": null,
  "message": "your response"
}

Examples:

User: Add Black T-Shirt size M to cart

{
  "intent": "add_to_cart",
  "product": "Black T-Shirt",
  "size": "M",
  "message": "Adding Black T-Shirt size M to cart."
}

User: Remove Black T-Shirt size M

{
  "intent": "remove_from_cart",
  "product": "Black T-Shirt",
  "size": "M",
  "message": "Removing Black T-Shirt size M from cart."
}

User: Checkout

{
  "intent": "checkout",
  "product": null,
  "size": null,
  "message": "Proceeding to checkout."
}

User message:
${message}
`);

    let text = result.response.text().trim();

    // Remove markdown if Gemini still adds it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let aiResponse;

    try {
    aiResponse = JSON.parse(text);
    } catch (parseError) {
    console.error("JSON Parse Error:", parseError);

    return NextResponse.json({
        success: true,
        intent: "recommend",
        product: null,
        size: null,
        message: text,
    });
    }

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
    return NextResponse.json(
        {
        success: false,
        message: "Please login first",
        },
        { status: 401 }
    );
    }

    if (
    aiResponse.intent === "add_to_cart" &&
    aiResponse.product &&
    aiResponse.size
    ) {

    const product = await Product.findOne({
        name: aiResponse.product.trim(),
    });


    if (!product) {
        return NextResponse.json({
        success: false,
        message: "Product not found",
        });
    }

    let cart = await Cart.findOne({
        userId: (session.user as any).id,
    });

    if (!cart) {
        cart = await Cart.create({
        userId: (session.user as any).id,
        items: [],
        });
    }

    const existingItem = cart.items.find(
        (item: any) =>
        item.productId.toString() === product._id.toString() &&
        item.size === aiResponse.size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
        productId: product._id,
        size: aiResponse.size,
        quantity: 1,
        });
    }

    await cart.save();

    return NextResponse.json({
        success: true,
        intent: aiResponse.intent,
        product: aiResponse.product,
        size: aiResponse.size,
        message: `${aiResponse.product} (${aiResponse.size}) added to cart.`,
    });
    }

    if (
        aiResponse.intent === "remove_from_cart" &&
        aiResponse.product &&
        aiResponse.size
    ) {
    const product = await Product.findOne({
        name: aiResponse.product.trim(),
    });

    if (!product) {
        return NextResponse.json({
        success: false,
        message: "Product not found",
        });
    }

    const cart = await Cart.findOne({
        userId: (session.user as any).id,
    });

    if (!cart) {
        return NextResponse.json({
        success: false,
        message: "Cart not found",
        });
    }

    cart.items = cart.items.filter(
        (item: any) =>
        !(
            item.productId.toString() === product._id.toString() &&
            item.size === aiResponse.size
        )
    );

    await cart.save();

    return NextResponse.json({
        success: true,
        intent: aiResponse.intent,
        product: aiResponse.product,
        size: aiResponse.size,
        message: `${aiResponse.product} (${aiResponse.size}) removed from cart.`,
    });
    }

    if (aiResponse.intent === "checkout") {
    const cart = await Cart.findOne({
        userId: (session.user as any).id,
    });

    if (!cart) {
        return NextResponse.json({
        success: false,
        message: "Cart not found",
        });
    }

    if (cart.items.length === 0) {
        return NextResponse.json({
        success: false,
        message: "Your cart is empty.",
        });
    }

    cart.items = [];

    await cart.save();

    return NextResponse.json({
        success: true,
        intent: "checkout",
        product: null,
        size: null,
        message: "Order placed successfully! Your cart has been cleared.",
    });
    }

    return NextResponse.json({
    success: true,
    intent: aiResponse.intent,
    product: aiResponse.product,
    size: aiResponse.size,
    message: aiResponse.message,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate response",
      },
      { status: 500 }
    );
  }
}