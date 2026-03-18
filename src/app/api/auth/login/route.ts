import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { createToken, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json(
        { error: "Le code d'accès est requis." },
        { status: 400 }
      );
    }

    const startup = await db.query.startups.findFirst({
      where: eq(startups.accessCode, accessCode.toUpperCase().trim()),
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Code d'accès invalide." },
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
