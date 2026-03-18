"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
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
            Formation commerciale — Incubateur UPVD
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-brand-blue-700 mb-6">
            Connexion
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Code d'accès"
              placeholder="Ex: BX7K2M"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl tracking-widest font-mono"
              error={error}
              autoFocus
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || accessCode.length < 6}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">Pas encore inscrit ?</p>
            <Button
              variant="outline"
              onClick={() => router.push("/register")}
              className="w-full"
            >
              Inscrire ma startup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
