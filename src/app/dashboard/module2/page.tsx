"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { TheoryKahneman } from "@/components/module2/TheoryKahneman";
import { TheoryBiases } from "@/components/module2/TheoryBiases";
import { BiasQuiz } from "@/components/module2/BiasQuiz";
import { BiasApplication } from "@/components/module2/BiasApplication";
import { Button } from "@/components/ui/Button";
import type { Stakeholder } from "@/db/schema";

type Step = "kahneman" | "quiz" | "biases" | "exercise";

export default function Module2Page() {
  const { startup, refreshStartup } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>("kahneman");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [quizDone, setQuizDone] = useState(false);

  const fetchData = useCallback(async () => {
    if (!startup) return;
    const res = await fetch(`/api/startups/${startup.id}/stakeholders`);
    const data = await res.json();
    setStakeholders(data.stakeholders || []);
  }, [startup]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!startup) return null;

  const criticalStakeholders = stakeholders
    .filter((s) => s.priority === "critique")
    .slice(0, 3);

  // If no critical, take top 3 by "important" then any
  const targetStakeholders = criticalStakeholders.length > 0
    ? criticalStakeholders
    : stakeholders.filter((s) => s.priority === "important").slice(0, 3).length > 0
    ? stakeholders.filter((s) => s.priority === "important").slice(0, 3)
    : stakeholders.slice(0, 3);

  async function handleValidate() {
    await fetch(`/api/startups/${startup!.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module2Complete: true }),
    });
    await refreshStartup();
    router.push("/dashboard");
  }

  const completionStatus = {
    module1Complete: startup.module1Complete,
    module2Complete: startup.module2Complete,
    module3Complete: startup.module3Complete,
    module4Complete: startup.module4Complete,
  };

  return (
    <div>
      <ProgressBar currentModule={2} completionStatus={completionStatus} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {step === "kahneman" && (
          <>
            <TheoryKahneman />
            <div className="mt-6 text-center">
              <Button size="lg" onClick={() => setStep("quiz")}>
                J&apos;ai compris, passer au quiz
              </Button>
            </div>
          </>
        )}

        {step === "quiz" && (
          <>
            <BiasQuiz
              startupId={startup.id}
              onComplete={() => {
                setQuizDone(true);
                setStep("biases");
              }}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep("kahneman")}
                className="text-sm text-brand-coral-500 hover:underline"
              >
                Revoir la théorie
              </button>
            </div>
          </>
        )}

        {step === "biases" && (
          <>
            <TheoryBiases />
            <div className="mt-6 text-center">
              <Button size="lg" onClick={() => setStep("exercise")}>
                J&apos;ai compris, passer à l&apos;exercice
              </Button>
            </div>
          </>
        )}

        {step === "exercise" && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-brand-blue-700">
                Identifier tes leviers cognitifs
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Pour chaque partie prenante critique, sélectionne 3 biais et décris comment tu pourrais les utiliser.
              </p>
              <button
                onClick={() => setStep("biases")}
                className="text-sm text-brand-coral-500 hover:underline mt-2"
              >
                Revoir les biais
              </button>
            </div>

            {targetStakeholders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500">Aucune partie prenante trouvée. Retourne au Module 1.</p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/module1")}>
                  Aller au Module 1
                </Button>
              </div>
            ) : (
              <BiasApplication
                startupId={startup.id}
                stakeholders={targetStakeholders}
              />
            )}

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Retour
              </Button>
              <Button onClick={handleValidate} disabled={!quizDone && targetStakeholders.length > 0}>
                Valider et continuer
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
