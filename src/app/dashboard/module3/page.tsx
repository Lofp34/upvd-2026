"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { TheoryMatrix } from "@/components/module3/TheoryMatrix";
import { MatrixTable } from "@/components/module3/MatrixTable";
import { Button } from "@/components/ui/Button";

interface StakeholderWithMatrix {
  id: string;
  name: string;
  role: string;
  category: string;
  priority: string;
  matrix: { id: string; apparentStake: string; deepStake: string; bridge: string }[];
}

export default function Module3Page() {
  const { startup, refreshStartup } = useAuth();
  const router = useRouter();
  const [showTheory, setShowTheory] = useState(true);
  const [stakeholders, setStakeholders] = useState<StakeholderWithMatrix[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
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
    fetchData();
  }, [fetchData]);

  if (!startup) return null;

  const completedCount = stakeholders.filter((s) => {
    const m = s.matrix?.[0];
    return m && m.apparentStake.trim() && m.deepStake.trim() && m.bridge.trim();
  }).length;

  const minReached = completedCount >= 3;

  async function handleValidate() {
    if (!minReached) return;
    await fetch(`/api/startups/${startup!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module3Complete: true }),
    });
    await refreshStartup();
    router.push("/dashboard");
  }

  if (showTheory) {
    return (
      <div>
        <ProgressBar
          currentModule={3}
          completionStatus={{
            module1Complete: startup.module1Complete,
            module2Complete: startup.module2Complete,
            module3Complete: startup.module3Complete,
            module4Complete: startup.module4Complete,
          }}
        />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TheoryMatrix />
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
        currentModule={3}
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
              Matrice des Enjeux
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pour chaque partie prenante, identifie les enjeux apparents, profonds, et le pont vers ta solution.
            </p>
          </div>
          <button
            onClick={() => setShowTheory(true)}
            className="text-sm text-brand-coral-500 hover:underline"
          >
            Revoir la théorie
          </button>
        </div>

        <div className="mb-4">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Progression : <span className="font-semibold">{completedCount}/{stakeholders.length}</span> parties prenantes complétées
            </span>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-coral-500 transition-all duration-300 rounded-full"
                style={{ width: `${stakeholders.length ? (completedCount / stakeholders.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Chargement...</div>
        ) : stakeholders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">Aucune partie prenante. Retourne au Module 1 pour en ajouter.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/module1")}>
              Aller au Module 1
            </Button>
          </div>
        ) : (
          <MatrixTable
            startupId={startup.id}
            stakeholders={stakeholders}
            onUpdate={fetchData}
          />
        )}

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              {!minReached && (
                <p className="text-xs text-amber-600">
                  Complète la matrice d&apos;au moins 3 parties prenantes pour continuer.
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Retour
              </Button>
              <Button onClick={handleValidate} disabled={!minReached}>
                Valider et voir ma synthèse
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
