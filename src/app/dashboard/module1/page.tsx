"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { TheoryCard } from "@/components/module1/TheoryCard";
import { StakeholderMap } from "@/components/module1/StakeholderMap";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import type { Stakeholder } from "@/db/schema";

export default function Module1Page() {
  const { startup, refreshStartup } = useAuth();
  const router = useRouter();
  const [showTheory, setShowTheory] = useState(true);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStakeholders = useCallback(async () => {
    if (!startup) return;
    try {
      const res = await fetch(`/api/startups/${startup.id}/stakeholders`);
      const data = await res.json();
      setStakeholders(data.stakeholders || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [startup]);

  useEffect(() => {
    fetchStakeholders();
  }, [fetchStakeholders]);

  if (!startup) return null;

  const categoriesWithStakeholders = new Set(stakeholders.map((s) => s.category));
  const minCategoriesReached = categoriesWithStakeholders.size >= 3;
  const totalStakeholders = stakeholders.length;

  async function handleValidate() {
    if (!minCategoriesReached) return;
    await fetch(`/api/startups/${startup!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module1Complete: true }),
    });
    await refreshStartup();
    router.push("/dashboard");
  }

  if (showTheory) {
    return (
      <div>
        <ProgressBar
          currentModule={1}
          completionStatus={{
            module1Complete: startup.module1Complete,
            module2Complete: startup.module2Complete,
            module3Complete: startup.module3Complete,
            module4Complete: startup.module4Complete,
          }}
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TheoryCard />
          <div className="mt-6 text-center">
            <Button size="lg" onClick={() => setShowTheory(false)}>
              J&apos;ai compris, passer à l&apos;exercice
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar
        currentModule={1}
        completionStatus={{
          module1Complete: startup.module1Complete,
          module2Complete: startup.module2Complete,
          module3Complete: startup.module3Complete,
          module4Complete: startup.module4Complete,
        }}
      />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-brand-blue-700">
              Cartographie des parties prenantes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Identifie les personnes et organisations clés de ton écosystème startup.
            </p>
          </div>
          <button
            onClick={() => setShowTheory(true)}
            className="text-sm text-brand-coral-500 hover:underline"
          >
            Revoir la théorie
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : (
          <StakeholderMap
            startupId={startup.id}
            stakeholders={stakeholders}
            onUpdate={fetchStakeholders}
          />
        )}

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{totalStakeholders}</span> parties prenantes dans{" "}
                <span className={`font-semibold ${minCategoriesReached ? "text-green-600" : "text-amber-600"}`}>
                  {categoriesWithStakeholders.size}/{CATEGORIES.length}
                </span>{" "}
                catégories
              </p>
              {!minCategoriesReached && (
                <p className="text-xs text-amber-600 mt-1">
                  Ajoute des parties prenantes dans au moins 3 catégories pour continuer.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Retour
              </Button>
              <Button
                onClick={handleValidate}
                disabled={!minCategoriesReached}
              >
                Valider et continuer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
