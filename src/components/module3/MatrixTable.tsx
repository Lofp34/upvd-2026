"use client";

import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import { THEORY_MATRIX } from "@/data/theory";

interface MatrixEntry {
  id: string;
  apparentStake: string;
  deepStake: string;
  bridge: string;
}

interface StakeholderWithMatrix {
  id: string;
  name: string;
  role: string;
  category: string;
  priority: string;
  matrix: MatrixEntry[];
}

interface Props {
  startupId: string;
  stakeholders: StakeholderWithMatrix[];
  onUpdate: () => void;
}

export function MatrixTable({ startupId, stakeholders, onUpdate }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const debouncedSave = useCallback(
    (stakeholderId: string, field: string, value: string) => {
      const key = `${stakeholderId}-${field}`;
      if (saveTimeoutRef.current[key]) {
        clearTimeout(saveTimeoutRef.current[key]);
      }
      saveTimeoutRef.current[key] = setTimeout(async () => {
        await fetch(
          `/api/startups/${startupId}/stakeholders/${stakeholderId}/matrix`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: value }),
          }
        );
        onUpdate();
      }, 800);
    },
    [startupId, onUpdate]
  );

  // Group by category
  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    stakeholders: stakeholders.filter((s) => s.category === cat.id),
  })).filter((g) => g.stakeholders.length > 0);

  return (
    <div className="space-y-6">
      {showHelp && (
        <div className="bg-brand-blue-50 border border-brand-blue-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-brand-blue-700">Questions pour identifier les enjeux profonds</h3>
            <button onClick={() => setShowHelp(false)} className="text-sm text-gray-500 hover:text-gray-700">
              Fermer
            </button>
          </div>
          <ul className="space-y-2">
            {THEORY_MATRIX.helpQuestions.map((q, i) => (
              <li key={i} className="text-sm text-brand-blue-700 flex gap-2">
                <span className="text-brand-coral-500 font-bold">?</span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-brand-coral-500 hover:underline flex items-center gap-1"
        >
          <span className="w-5 h-5 bg-brand-coral-500 text-white rounded-full flex items-center justify-center text-xs font-bold">?</span>
          Aide : questions de réflexion
        </button>
      </div>

      {grouped.map((group) => (
        <div key={group.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-brand-blue-500/5 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span>{group.icon}</span>
              <h3 className="font-semibold text-brand-blue-700 text-sm">{group.label}</h3>
              <span className="text-xs text-gray-400">({group.stakeholders.length})</span>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {group.stakeholders.map((s) => {
              const matrix = s.matrix?.[0];
              const isComplete = matrix && matrix.apparentStake.trim() && matrix.deepStake.trim() && matrix.bridge.trim();
              const isExpanded = expandedId === s.id;

              return (
                <div key={s.id} className={`${isComplete ? "bg-green-50/30" : ""}`}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${isComplete ? "bg-green-500" : "bg-gray-300"}`} />
                      <span className="font-medium text-brand-blue-700 text-sm">{s.name}</span>
                      {s.role && <span className="text-xs text-gray-400">{s.role}</span>}
                      <Badge priority={s.priority as "critique" | "important" | "secondaire"} />
                    </div>
                    <span className="text-gray-400 text-sm">{isExpanded ? "\u25B2" : "\u25BC"}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      <Textarea
                        label="Enjeu apparent"
                        placeholder="Ce que cette partie prenante SEMBLE vouloir..."
                        defaultValue={matrix?.apparentStake || ""}
                        onChange={(e) => debouncedSave(s.id, "apparentStake", e.target.value)}
                      />
                      <Textarea
                        label="Enjeu profond"
                        placeholder="Ce qui anime VRAIMENT cette personne..."
                        defaultValue={matrix?.deepStake || ""}
                        onChange={(e) => debouncedSave(s.id, "deepStake", e.target.value)}
                        rows={4}
                      />
                      <Textarea
                        label="Pont vers ma solution"
                        placeholder="Le lien entre mon offre et son enjeu profond..."
                        defaultValue={matrix?.bridge || ""}
                        onChange={(e) => debouncedSave(s.id, "bridge", e.target.value)}
                        rows={4}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
