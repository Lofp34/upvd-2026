"use client";

import { useState, useEffect, useCallback } from "react";
import { BIASES } from "@/data/biases";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import type { Stakeholder } from "@/db/schema";

interface Props {
  startupId: string;
  stakeholders: Stakeholder[];
}

interface BiasEntry {
  biasName: string;
  application: string;
}

export function BiasApplication({ startupId, stakeholders }: Props) {
  const [biasMap, setBiasMap] = useState<Record<string, BiasEntry[]>>({});

  const fetchBiases = useCallback(async () => {
    const newMap: Record<string, BiasEntry[]> = {};
    for (const s of stakeholders) {
      const res = await fetch(
        `/api/startups/${startupId}/stakeholders/${s.id}/bias`
      );
      const data = await res.json();
      newMap[s.id] = (data.biasApplications || []).map((b: { biasName: string; application: string }) => ({
        biasName: b.biasName,
        application: b.application,
      }));
    }
    setBiasMap(newMap);
  }, [startupId, stakeholders]);

  useEffect(() => {
    fetchBiases();
  }, [fetchBiases]);

  function toggleBias(stakeholderId: string, biasId: string) {
    const current = biasMap[stakeholderId] || [];
    const exists = current.find((b) => b.biasName === biasId);
    let updated: BiasEntry[];
    if (exists) {
      updated = current.filter((b) => b.biasName !== biasId);
    } else {
      if (current.length >= 3) return; // Max 3 biases
      updated = [...current, { biasName: biasId, application: "" }];
    }
    setBiasMap({ ...biasMap, [stakeholderId]: updated });
  }

  function updateApplication(stakeholderId: string, biasId: string, text: string) {
    const current = biasMap[stakeholderId] || [];
    const updated = current.map((b) =>
      b.biasName === biasId ? { ...b, application: text } : b
    );
    setBiasMap({ ...biasMap, [stakeholderId]: updated });
  }

  async function saveBiases(stakeholderId: string) {
    const biases = biasMap[stakeholderId] || [];
    await fetch(
      `/api/startups/${startupId}/stakeholders/${stakeholderId}/bias`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biases }),
      }
    );
  }

  return (
    <div className="space-y-6">
      {stakeholders.map((s) => {
        const selected = biasMap[s.id] || [];

        return (
          <div key={s.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <span className="font-semibold text-brand-blue-700">{s.name}</span>
              {s.role && <span className="text-sm text-gray-400">{s.role}</span>}
              <Badge priority={s.priority as "critique" | "important" | "secondaire"} />
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-600 mb-3">
                Sélectionne 3 biais pertinents ({selected.length}/3) :
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {BIASES.map((bias) => {
                  const isSelected = selected.some((b) => b.biasName === bias.id);
                  const disabled = !isSelected && selected.length >= 3;

                  return (
                    <button
                      key={bias.id}
                      onClick={() => toggleBias(s.id, bias.id)}
                      disabled={disabled}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? "bg-brand-coral-500 text-white"
                          : disabled
                          ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {bias.name}
                    </button>
                  );
                })}
              </div>

              {selected.length > 0 && (
                <div className="space-y-3">
                  {selected.map((entry) => {
                    const bias = BIASES.find((b) => b.id === entry.biasName);
                    return (
                      <div key={entry.biasName} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-brand-coral-500 mb-2">
                          {bias?.name}
                        </p>
                        <Textarea
                          placeholder="Décris comment tu pourrais utiliser ce biais concrètement..."
                          value={entry.application}
                          onChange={(e) => updateApplication(s.id, entry.biasName, e.target.value)}
                          onBlur={() => saveBiases(s.id)}
                          rows={2}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
