import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

// GET messages for a study room
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;

    // Check if user is a member of the room
    const member = await prisma.studyRoomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: params.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Not a member of this room" },
        { status: 403 }
      );
    }

    const messages = await prisma.studyRoomMessage.findMany({
      where: {
        roomId: params.id,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 100, // Limit to last 100 messages
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST send a message to a study room
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;

    // Check if user is a member of the room
    const member = await prisma.studyRoomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: params.id,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Not a member of this room" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = messageSchema.parse(body);

    const message = await prisma.studyRoomMessage.create({
      data: {
        roomId: params.id,
        userId: session.user.id,
        userName: member.user.name || "Anonymous",
        message: validatedData.message,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

// Made with Bob
