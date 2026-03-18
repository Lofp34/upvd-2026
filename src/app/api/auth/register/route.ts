import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { generateAccessCode, createToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

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

    // Generate unique access code
    let accessCode: string;
    let attempts = 0;
    do {
      accessCode = generateAccessCode();
      const existing = await db.query.startups.findFirst({
        where: eq(startups.accessCode, accessCode),
      });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    const [startup] = await db
      .insert(startups)
      .values({
        accessCode,
        startupName,
        founderName,
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
        accessCode: startup.accessCode,
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
