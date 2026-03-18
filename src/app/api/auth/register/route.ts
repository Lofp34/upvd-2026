import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { generateAccessCode, createToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupName, founderName, password, sector, stage } = body;

    if (!startupName || !founderName || !password) {
      return NextResponse.json(
        { error: "Le nom de la startup, du fondateur et le mot de passe sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 4 caractères." },
        { status: 400 }
      );
    }

    // Check if startup name already taken
    const existing = await db.query.startups.findFirst({
      where: eq(startups.startupName, startupName.trim()),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Ce nom de startup est déjà pris. Choisis-en un autre ou connecte-toi." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const accessCode = generateAccessCode();

    const [startup] = await db
      .insert(startups)
      .values({
        accessCode,
        startupName: startupName.trim(),
        founderName: founderName.trim(),
        password: hashedPassword,
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
