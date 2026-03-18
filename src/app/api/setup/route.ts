import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL not set" }, { status: 500 });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create enums (ignore if already exist)
    await sql`DO $$ BEGIN
      CREATE TYPE stakeholder_category AS ENUM ('accompagnateurs', 'equipe', 'utilisateurs_clients', 'financeurs', 'partenaires', 'ecosysteme');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`;

    await sql`DO $$ BEGIN
      CREATE TYPE stakeholder_priority AS ENUM ('critique', 'important', 'secondaire');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`;

    await sql`DO $$ BEGIN
      CREATE TYPE bias_name AS ENUM ('ancrage', 'confirmation', 'preuve_sociale', 'aversion_perte', 'statu_quo', 'halo', 'rarete', 'reciprocite');
    EXCEPTION WHEN duplicate_object THEN NULL; END $$`;

    // Create tables
    await sql`CREATE TABLE IF NOT EXISTS startups (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      access_code TEXT UNIQUE NOT NULL,
      startup_name TEXT NOT NULL,
      password TEXT NOT NULL DEFAULT '',
      sector TEXT,
      stage TEXT,
      founder_name TEXT NOT NULL,
      module1_complete BOOLEAN NOT NULL DEFAULT FALSE,
      module2_complete BOOLEAN NOT NULL DEFAULT FALSE,
      module3_complete BOOLEAN NOT NULL DEFAULT FALSE,
      module4_complete BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    // Add password column if missing (for existing databases)
    await sql`ALTER TABLE startups ADD COLUMN IF NOT EXISTS password TEXT NOT NULL DEFAULT ''`;

    await sql`CREATE TABLE IF NOT EXISTS stakeholders (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
      category stakeholder_category NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT '',
      priority stakeholder_priority NOT NULL DEFAULT 'secondaire',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS bias_applications (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      stakeholder_id UUID NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
      bias_name bias_name NOT NULL,
      application TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS stakeholder_matrix (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      stakeholder_id UUID NOT NULL REFERENCES stakeholders(id) ON DELETE CASCADE,
      apparent_stake TEXT NOT NULL DEFAULT '',
      deep_stake TEXT NOT NULL DEFAULT '',
      bridge TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS quiz_responses (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      selected_answer TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    return NextResponse.json({
      success: true,
      message: "Toutes les tables ont été créées avec succès !"
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({
      error: "Erreur lors de la création des tables",
      details: String(error)
    }, { status: 500 });
  }
}
