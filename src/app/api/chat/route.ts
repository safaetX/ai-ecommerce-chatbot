import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import {
  addToCart,
  checkout,
  removeFromCart,
} from "@/lib/chatActions";
import connectDB from "@/lib/mongodb";
import {
  type ProductSearchFilters,
  searchProducts,
} from "@/lib/productSearch";
import Product from "@/models/Product";

type ChatIntent =
  | "search_products"
  | "add_to_cart"
  | "remove_from_cart"
  | "checkout";

interface ChatAIResponse {
  intent: ChatIntent;
  filters?: ProductSearchFilters;
  product: string | null;
  size: string | null;
  message: string;
}

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

function normalizeFilters(filters: unknown): ProductSearchFilters {
  if (!filters || typeof filters !== "object") {
    return {};
  }

  const input = filters as ProductSearchFilters;

  return {
    category: typeof input.category === "string" ? input.category : undefined,
    minPrice: typeof input.minPrice === "number" ? input.minPrice : undefined,
    maxPrice: typeof input.maxPrice === "number" ? input.maxPrice : undefined,
    keywords: Array.isArray(input.keywords)
      ? input.keywords.filter((keyword) => typeof keyword === "string")
      : undefined,
    color: typeof input.color === "string" ? input.color : undefined,
    size: typeof input.size === "string" ? input.size : undefined,
    inStock: typeof input.inStock === "boolean" ? input.inStock : undefined,
    limit: 5,
  };
}

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history = [],
    } = await req.json();

    await connectDB();

    const products = await Product.find();

    const productList = products
      .map(
        (product) =>
          `ID: ${product._id}
Name: ${product.name}
Description: ${product.description}
Price: Tk ${product.price}
Category: ${product.category}
Stock: S=${product.stock.S}, M=${product.stock.M}, L=${product.stock.L}, XL=${product.stock.XL}, XXL=${product.stock.XXL}`
      )
      .join("\n\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const conversationHistory = history
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role}: ${msg.content}`
      )
      .join("\n");

    const result = await model.generateContent(`
You are an AI shopping assistant.

Conversation history:

${conversationHistory}

Current user message:

${message}

Available products:

${productList}

Analyze the user's message and determine the intent.

Possible intents:
- search_products
- add_to_cart
- remove_from_cart
- checkout

IMPORTANT RULES:

- Always return valid JSON.
- Never return conversational replies outside JSON.
- Gemini decides intent and structured filters only.
- MongoDB decides what products exist. Never invent products.
- Use search_products for browsing, recommendations, category, color, price, or stock questions.
- For search_products, return filters only. Do not list product results yourself.
- For add_to_cart and remove_from_cart, product must be an exact product name from the catalog.
- For add_to_cart and remove_from_cart, always try to identify the exact product and size.
- If the user does not provide enough information for a cart action, set intent to "search_products".
- If product name is missing, ask the user to provide the full product name inside the JSON message field.
- If size is missing, ask the user to provide the size inside the JSON message field.
- Never return partial actions.

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in \`\`\`.
Do not include explanations.

JSON format:

{
  "intent": "search_products",
  "filters": {},
  "product": null,
  "size": null,
  "message": "your response"
}

Examples:

User: Show me t-shirts

{
  "intent": "search_products",
  "filters": { "category": "t-shirt" },
  "product": null,
  "size": null,
  "message": "Here are some t-shirts from our catalog."
}

User: Show me products under 1000 taka

{
  "intent": "search_products",
  "filters": { "maxPrice": 1000 },
  "product": null,
  "size": null,
  "message": "Here are products under Tk 1000."
}

User: Recommend something casual

{
  "intent": "search_products",
  "filters": { "keywords": ["casual", "comfortable"] },
  "product": null,
  "size": null,
  "message": "Here are some casual options from our catalog."
}

User: Show me black products

{
  "intent": "search_products",
  "filters": { "keywords": ["black"] },
  "product": null,
  "size": null,
  "message": "Here are black products from our catalog."
}

User: Show me pants under 1500

{
  "intent": "search_products",
  "filters": { "category": "pants", "maxPrice": 1500 },
  "product": null,
  "size": null,
  "message": "Here are pants under Tk 1500."
}

User: remove M size tshirt from cart

{
  "intent": "search_products",
  "filters": { "category": "t-shirt", "size": "M", "inStock": true },
  "product": null,
  "size": null,
  "message": "Please specify the exact product name, for example: Remove Black T-Shirt size M."
}

User: add tshirt to cart

{
  "intent": "search_products",
  "filters": { "category": "t-shirt" },
  "product": null,
  "size": null,
  "message": "Please specify both product name and size."
}

User: Add Black T-Shirt size M to cart

{
  "intent": "add_to_cart",
  "filters": {},
  "product": "Black T-Shirt",
  "size": "M",
  "message": "Adding Black T-Shirt size M to cart."
}

User: Remove Black T-Shirt size M

{
  "intent": "remove_from_cart",
  "filters": {},
  "product": "Black T-Shirt",
  "size": "M",
  "message": "Removing Black T-Shirt size M from cart."
}

User: Checkout

{
  "intent": "checkout",
  "filters": {},
  "product": null,
  "size": null,
  "message": "Proceeding to checkout."
}

`);

    let text = result.response.text().trim();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let aiResponse: ChatAIResponse;

    try {
      aiResponse = JSON.parse(text) as ChatAIResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);

      return NextResponse.json({
        success: true,
        intent: "search_products",
        product: null,
        size: null,
        message: text,
        products: [],
      });
    }

    if (aiResponse.intent === "search_products") {
      const filters = normalizeFilters(aiResponse.filters);
      const matchingProducts = await searchProducts(filters);

      return NextResponse.json({
        success: true,
        intent: "search_products",
        filters,
        product: null,
        size: null,
        message:
          matchingProducts.length > 0
            ? aiResponse.message
            : "No products found. Try t-shirts, pants, black products, or products under Tk 1000.",
        products: matchingProducts,
      });
    }

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
      const result = await addToCart(
        (session.user as { id: string }).id,
        aiResponse.product,
        aiResponse.size
      );

      return NextResponse.json({
        success: result.success,
        intent: aiResponse.intent,
        product: aiResponse.product,
        size: aiResponse.size,
        message: result.message,
      });
    }

    if (
      aiResponse.intent === "remove_from_cart" &&
      aiResponse.product &&
      aiResponse.size
    ) {
      const result = await removeFromCart(
        (session.user as { id: string }).id,
        aiResponse.product,
        aiResponse.size
      );

      return NextResponse.json({
        success: result.success,
        intent: aiResponse.intent,
        product: aiResponse.product,
        size: aiResponse.size,
        message: result.message,
      });
    }

    if (aiResponse.intent === "checkout") {
      const result = await checkout(
        (session.user as { id: string }).id
      );

      return NextResponse.json({
        success: result.success,
        intent: "checkout",
        message: result.message,
      });
    }

    return NextResponse.json({
      success: true,
      intent: aiResponse.intent,
      product: aiResponse.product,
      size: aiResponse.size,
      message: aiResponse.message,
    });
  }catch (error: any) {
    console.error("CHAT ERROR:", error);

    let message =
      "AI service is temporarily unavailable. Please try again later.";

    if (error?.status === 429) {
      message =
        "AI quota exceeded. Please try again later.";
    } else if (error?.status === 503) {
      message =
        "AI service is currently busy. Please try again in a moment.";
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
