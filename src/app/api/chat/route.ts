import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
You are an AI shopping assistant for an online clothing store.

Products:
- Black T-Shirt (৳799)
- White T-Shirt (৳699)
- Blue Jeans (৳1499)
- Black Pants (৳1299)

User Message:
${message}

Respond as a helpful shopping assistant.
`);

    const response = result.response.text();

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate response",
      },
      { status: 500 }
    );
  }
}