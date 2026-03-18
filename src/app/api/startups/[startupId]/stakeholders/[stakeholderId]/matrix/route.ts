import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stakeholderMatrix, stakeholders } from "@/db/schema";
import { getSessionStartupId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ startupId: string; stakeholderId: string }> }
) {
  const { startupId, stakeholderId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const result = await db.query.stakeholderMatrix.findFirst({
    where: eq(stakeholderMatrix.stakeholderId, stakeholderId),
  });

  return NextResponse.json({ matrix: result || null });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string; stakeholderId: string }> }
) {
  const { startupId, stakeholderId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Verify stakeholder belongs to startup
  const stakeholder = await db.query.stakeholders.findFirst({
    where: and(eq(stakeholders.id, stakeholderId), eq(stakeholders.startupId, startupId)),
  });
  if (!stakeholder) {
    return NextResponse.json({ error: "Partie prenante non trouvée" }, { status: 404 });
  }

  const body = await request.json();
  const { apparentStake, deepStake, bridge } = body;

  // Upsert: check if entry exists
  const existing = await db.query.stakeholderMatrix.findFirst({
    where: eq(stakeholderMatrix.stakeholderId, stakeholderId),
  });

  let result;
  if (existing) {
    [result] = await db
      .update(stakeholderMatrix)
      .set({
        apparentStake: apparentStake ?? existing.apparentStake,
        deepStake: deepStake ?? existing.deepStake,
        bridge: bridge ?? existing.bridge,
        updatedAt: new Date(),
      })
      .where(eq(stakeholderMatrix.id, existing.id))
      .returning();
  } else {
    [result] = await db
      .insert(stakeholderMatrix)
      .values({
        stakeholderId,
        apparentStake: apparentStake || "",
        deepStake: deepStake || "",
        bridge: bridge || "",
      })
      .returning();
  }

  return NextResponse.json({ matrix: result });
}
