import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { biasApplications, stakeholders } from "@/db/schema";
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

  const result = await db.query.biasApplications.findMany({
    where: eq(biasApplications.stakeholderId, stakeholderId),
  });

  return NextResponse.json({ biasApplications: result });
}

export async function POST(
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
  const { biases } = body; // Array of { biasName, application }

  if (!Array.isArray(biases)) {
    return NextResponse.json({ error: "Format invalide" }, { status: 400 });
  }

  // Delete existing bias applications for this stakeholder and replace
  await db.delete(biasApplications).where(eq(biasApplications.stakeholderId, stakeholderId));

  if (biases.length > 0) {
    const values = biases.map((b: { biasName: string; application: string }) => ({
      stakeholderId,
      biasName: b.biasName as "ancrage" | "confirmation" | "preuve_sociale" | "aversion_perte" | "statu_quo" | "halo" | "rarete" | "reciprocite",
      application: b.application || "",
    }));

    await db.insert(biasApplications).values(values);
  }

  const updated = await db.query.biasApplications.findMany({
    where: eq(biasApplications.stakeholderId, stakeholderId),
  });

  return NextResponse.json({ biasApplications: updated });
}
