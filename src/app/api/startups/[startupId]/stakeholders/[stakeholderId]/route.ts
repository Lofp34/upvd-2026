import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { stakeholders } from "@/db/schema";
import { getSessionStartupId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string; stakeholderId: string }> }
) {
  const { startupId, stakeholderId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = ["name", "role", "category", "priority"];
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  const [updated] = await db
    .update(stakeholders)
    .set(updates)
    .where(and(eq(stakeholders.id, stakeholderId), eq(stakeholders.startupId, startupId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Partie prenante non trouvée" }, { status: 404 });
  }

  return NextResponse.json({ stakeholder: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ startupId: string; stakeholderId: string }> }
) {
  const { startupId, stakeholderId } = await params;
  const sessionId = await getSessionStartupId();
  if (!sessionId || sessionId !== startupId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [deleted] = await db
    .delete(stakeholders)
    .where(and(eq(stakeholders.id, stakeholderId), eq(stakeholders.startupId, startupId)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Partie prenante non trouvée" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
