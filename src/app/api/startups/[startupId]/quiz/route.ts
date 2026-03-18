import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizResponses } from "@/db/schema";
import { getSessionStartupId } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  const { startupId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const result = await db.query.quizResponses.findMany({
    where: eq(quizResponses.startupId, startupId),
  });

  return NextResponse.json({ quizResponses: result });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  const { startupId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { responses } = body; // Array of { questionId, selectedAnswer, isCorrect }

  if (!Array.isArray(responses)) {
    return NextResponse.json({ error: "Format invalide" }, { status: 400 });
  }

  // Delete existing quiz responses for this startup and replace
  await db.delete(quizResponses).where(eq(quizResponses.startupId, startupId));

  if (responses.length > 0) {
    const values = responses.map((r: { questionId: string; selectedAnswer: string; isCorrect: boolean }) => ({
      startupId,
      questionId: r.questionId,
      selectedAnswer: r.selectedAnswer,
      isCorrect: r.isCorrect,
    }));

    await db.insert(quizResponses).values(values);
  }

  const updated = await db.query.quizResponses.findMany({
    where: eq(quizResponses.startupId, startupId),
  });

  return NextResponse.json({ quizResponses: updated });
}
