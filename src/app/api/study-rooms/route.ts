import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const studyRoomSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  subject: z.string().min(1, "Subject is required"),
  maxParticipants: z.number().min(2).max(10).default(4),
  isPrivate: z.boolean().default(false),
});

// Generate a unique 6-character room code
function generateRoomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// GET all active study rooms
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");
    const myRooms = searchParams.get("myRooms") === "true";

    const rooms = await prisma.studyRoom.findMany({
      where: {
        isActive: true,
        ...(subject && subject !== "All" ? { subject } : {}),
        ...(myRooms ? {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        } : {}),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    console.error("Get study rooms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch study rooms" },
      { status: 500 }
    );
  }
}

// POST create a new study room
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = studyRoomSchema.parse(body);

    // Generate unique room code
    let code = generateRoomCode();
    let existingRoom = await prisma.studyRoom.findUnique({
      where: { code },
    });

    // Regenerate if code already exists
    while (existingRoom) {
      code = generateRoomCode();
      existingRoom = await prisma.studyRoom.findUnique({
        where: { code },
      });
    }

    // Create room and add creator as host
    const room = await prisma.studyRoom.create({
      data: {
        ...validatedData,
        code,
        members: {
          create: {
            userId: session.user.id,
            role: "host",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create study room error:", error);
    return NextResponse.json(
      { error: "Failed to create study room" },
      { status: 500 }
    );
  }
}

// Made with Bob
