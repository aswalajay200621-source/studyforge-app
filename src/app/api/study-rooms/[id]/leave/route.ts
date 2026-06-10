import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST leave a study room
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;

    // Check if user is a member
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
        { status: 400 }
      );
    }

    // Mark as offline instead of deleting
    await prisma.studyRoomMember.update({
      where: {
        id: member.id,
      },
      data: {
        isOnline: false,
      },
    });

    // Check if room is empty (no online members)
    const onlineMembers = await prisma.studyRoomMember.count({
      where: {
        roomId: params.id,
        isOnline: true,
      },
    });

    // If no online members, deactivate the room
    if (onlineMembers === 0) {
      await prisma.studyRoom.update({
        where: { id: params.id },
        data: { isActive: false },
      });
    }

    return NextResponse.json(
      { message: "Left room successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Failed to leave room" },
      { status: 500 }
    );
  }
}

// Made with Bob
