import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { generateAccessCode, createToken, setSessionCookie } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupName, founderName, sector, stage } = body;

    if (!startupName || !founderName) {
      return NextResponse.json(
        { error: "Le nom de la startup et du fondateur sont requis." },
        { status: 400 }
      );
    }

    // Check if startup already exists with same name + founder
    const existing = await db.query.startups.findFirst({
      where: and(
        eq(startups.startupName, startupName.trim()),
        eq(startups.founderName, founderName.trim())
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Une startup avec ce nom et ce fondateur existe déjà. Utilise la connexion." },
        { status: 409 }
      );
    }

    // Generate access code (kept for internal reference)
    const accessCode = generateAccessCode();

    const [startup] = await db
      .insert(startups)
      .values({
        accessCode,
        startupName: startupName.trim(),
        founderName: founderName.trim(),
        sector: sector || null,
        stage: stage || null,
      })
      .returning();

    const token = await createToken(startup.id);
    await setSessionCookie(token);

    return NextResponse.json({
      startup: {
        id: startup.id,
        startupName: startup.startupName,
        founderName: startup.founderName,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription." },
      { status: 500 }
    );
  }
}
