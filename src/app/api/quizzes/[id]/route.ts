import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateQuizSchema = z.object({
  title: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.number(),
    explanation: z.string().optional(),
  })).optional(),
  totalScore: z.number().optional(),
  userScore: z.number().optional(),
  completed: z.boolean().optional(),
  color: z.string().optional(),
});

// GET a single quiz
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

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    console.error("Get quiz error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT update a quiz
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
    const validatedData = updateQuizSchema.parse(body);

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    const quiz = await prisma.quiz.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Update quiz error:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE a quiz
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

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    await prisma.quiz.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Quiz deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

// Made with Bob
