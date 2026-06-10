import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongodb";
import { authOptions } from "@/lib/auth";
import Conversation from "@/models/Conversation";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          messages: [],
        },
        { status: 401 }
      );
    }

    const messages = await Conversation.find({
      userId: (session.user as any).id,
    })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        messages: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const { role, content } = await req.json();

    const message = await Conversation.create({
      userId: (session.user as any).id,
      role,
      content,
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}