import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { createToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupName, password } = body;

    if (!startupName || !password) {
      return NextResponse.json(
        { error: "Le nom de la startup et le mot de passe sont requis." },
        { status: 400 }
      );
    }

    const startup = await db.query.startups.findFirst({
      where: eq(startups.startupName, startupName.trim()),
    });

    if (!startup || !startup.password) {
      return NextResponse.json(
        { error: "Startup introuvable ou mot de passe non défini." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, startup.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Mot de passe incorrect." },
        { status: 401 }
      );
    }

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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la connexion." },
      { status: 500 }
    );
  }
}
