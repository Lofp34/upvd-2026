import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stakeholders } from "@/db/schema";
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

  const result = await db.query.stakeholders.findMany({
    where: eq(stakeholders.startupId, startupId),
    with: { biasApplications: true, matrix: true },
  });

  return NextResponse.json({ stakeholders: result });
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
  const { name, role, category, priority } = body;

  if (!name || !category) {
    return NextResponse.json({ error: "Nom et catégorie requis" }, { status: 400 });
  }

  const [created] = await db
    .insert(stakeholders)
    .values({
      startupId,
      name,
      role: role || "",
      category,
      priority: priority || "secondaire",
    })
    .returning();

  return NextResponse.json({ stakeholder: created }, { status: 201 });
}
