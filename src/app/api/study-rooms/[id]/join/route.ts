import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST join a study room
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

    // Check if room exists and is active
    const room = await prisma.studyRoom.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    if (!room.isActive) {
      return NextResponse.json(
        { error: "Room is no longer active" },
        { status: 400 }
      );
    }

    // Check if room is full
    if (room._count.members >= room.maxParticipants) {
      return NextResponse.json(
        { error: "Room is full" },
        { status: 400 }
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.studyRoomMember.findUnique({
      where: {
        userId_roomId: {
          userId: session.user.id,
          roomId: params.id,
        },
      },
    });

    if (existingMember) {
      // Update to online if already a member
      await prisma.studyRoomMember.update({
        where: {
          id: existingMember.id,
        },
        data: {
          isOnline: true,
        },
      });

      return NextResponse.json(
        { message: "Rejoined room successfully" },
        { status: 200 }
      );
    }

    // Add user as member
    await prisma.studyRoomMember.create({
      data: {
        userId: session.user.id,
        roomId: params.id,
        role: "member",
      },
    });

    return NextResponse.json(
      { message: "Joined room successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    );
  }
}

// Made with Bob
