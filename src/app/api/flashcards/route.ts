import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const flashcardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  cards: z.array(z.object({
    front: z.string(),
    back: z.string(),
    mastered: z.boolean().default(false),
  })),
  color: z.string().default("#10B981"),
});

// GET all flashcards for the authenticated user
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

    const flashcards = await prisma.flashcard.findMany({
      where: {
        userId: session.user.id,
        ...(subject && subject !== "All" ? { subject } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ flashcards }, { status: 200 });
  } catch (error) {
    console.error("Get flashcards error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 }
    );
  }
}

// POST create new flashcards
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
    const validatedData = flashcardSchema.parse(body);

    const flashcard = await prisma.flashcard.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ flashcard }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Create flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to create flashcard" },
      { status: 500 }
    );
  }
}

// Made with Bob
