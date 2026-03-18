import { NextResponse } from "next/server";
import { db } from "@/db";
import { startups } from "@/db/schema";
import { getSessionStartupId } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const startupId = await getSessionStartupId();
    if (!startupId) {
      return NextResponse.json({ startup: null }, { status: 401 });
    }

    const startup = await db.query.startups.findFirst({
      where: eq(startups.id, startupId),
    });

    if (!startup) {
      return NextResponse.json({ startup: null }, { status: 401 });
    }

    return NextResponse.json({
      startup: {
        id: startup.id,
        startupName: startup.startupName,
        founderName: startup.founderName,
        sector: startup.sector,
        stage: startup.stage,
        module1Complete: startup.module1Complete,
        module2Complete: startup.module2Complete,
        module3Complete: startup.module3Complete,
        module4Complete: startup.module4Complete,
      },
    });
  } catch {
    return NextResponse.json({ startup: null }, { status: 500 });
  }
}
