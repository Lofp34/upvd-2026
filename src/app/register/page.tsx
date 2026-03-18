"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SECTORS, STAGES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    startupName: "",
    founderName: "",
    sector: "",
    stage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'inscription");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue-500 mb-2">
            Bible Commerciale
          </h1>
          <p className="text-brand-blue-700 opacity-75">
            Inscris ta startup pour commencer
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Nom de la startup *"
              placeholder="Ex: TechVision"
              value={form.startupName}
              onChange={(e) => setForm({ ...form, startupName: e.target.value })}
              required
            />
            <Input
              label="Nom du fondateur *"
              placeholder="Ex: Marie Dupont"
              value={form.founderName}
              onChange={(e) => setForm({ ...form, founderName: e.target.value })}
              required
            />
            <Select
              label="Secteur d'activité"
              options={[...SECTORS]}
              placeholder="Sélectionne ton secteur"
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
            />
            <Select
              label="Stade de développement"
              options={[...STAGES]}
              placeholder="Sélectionne ton stade"
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value })}
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !form.startupName || !form.founderName}
            >
              {loading ? "Inscription..." : "Inscrire ma startup"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-brand-blue-500 hover:underline"
            >
              J&apos;ai déjà un compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
