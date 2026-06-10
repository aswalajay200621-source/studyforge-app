import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateFlashcardSchema = z.object({
  title: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  cards: z.array(z.object({
    front: z.string(),
    back: z.string(),
    mastered: z.boolean(),
  })).optional(),
  color: z.string().optional(),
});

// GET a single flashcard set
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const flashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ flashcard }, { status: 200 });
  } catch (error) {
    console.error("Get flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcard" },
      { status: 500 }
    );
  }
}

// PUT update a flashcard set
export async function PUT(
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
    const body = await request.json();
    const validatedData = updateFlashcardSchema.parse(body);

    const existingFlashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingFlashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    const flashcard = await prisma.flashcard.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ flashcard }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Update flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard" },
      { status: 500 }
    );
  }
}

// DELETE a flashcard set
export async function DELETE(
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

    const existingFlashcard = await prisma.flashcard.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingFlashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    await prisma.flashcard.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Flashcard deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete flashcard error:", error);
    return NextResponse.json(
      { error: "Failed to delete flashcard" },
      { status: 500 }
    );
  }
}

// Made with Bob
