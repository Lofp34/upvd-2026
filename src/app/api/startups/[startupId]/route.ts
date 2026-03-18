import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
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

  const startup = await db.query.startups.findFirst({
    where: eq(startups.id, startupId),
    with: {
      stakeholders: {
        with: {
          biasApplications: true,
          matrix: true,
        },
      },
      quizResponses: true,
    },
  });

  if (!startup) {
    return NextResponse.json({ error: "Startup non trouvée" }, { status: 404 });
  }

  return NextResponse.json({ startup });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  const { startupId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = [
    "startupName", "sector", "stage", "founderName",
    "module1Complete", "module2Complete", "module3Complete", "module4Complete",
  ];

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const [updated] = await db
    .update(startups)
    .set(updates)
    .where(eq(startups.id, startupId))
    .returning();

  return NextResponse.json({ startup: updated });
}
