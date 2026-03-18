import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { createToken, setSessionCookie } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startupName, founderName } = body;

    if (!startupName || !founderName) {
      return NextResponse.json(
        { error: "Le nom de la startup et du fondateur sont requis." },
        { status: 400 }
      );
    }

    const startup = await db.query.startups.findFirst({
      where: and(
        eq(startups.startupName, startupName.trim()),
        eq(startups.founderName, founderName.trim())
      ),
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Aucun compte trouvé avec ce nom de startup et de fondateur." },
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
