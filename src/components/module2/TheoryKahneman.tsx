"use client";

import { THEORY_KAHNEMAN } from "@/data/theory";

export function TheoryKahneman() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-blue-500 px-6 py-4">
        <p className="text-brand-coral-300 text-sm font-medium">Fiche 2.1</p>
        <h2 className="text-xl font-bold text-white">{THEORY_KAHNEMAN.title}</h2>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-gray-700 leading-relaxed">{THEORY_KAHNEMAN.intro}</p>

        <div className="grid md:grid-cols-2 gap-4">
          {THEORY_KAHNEMAN.systems.map((sys, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 border-2 ${
                idx === 0
                  ? "bg-brand-coral-500/5 border-brand-coral-300"
                  : "bg-brand-blue-50 border-brand-blue-200"
              }`}
            >
              <h3 className="font-bold text-brand-blue-700 mb-3">{sys.name}</h3>
              <ul className="space-y-1 mb-3">
                {sys.traits.map((trait, i) => (
                  <li key={i} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-brand-coral-500">&#9679;</span>
                    {trait}
                  </li>
                ))}
              </ul>
              <div className="bg-white/60 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-500 font-medium mb-1">Exemples :</p>
                <p className="text-sm text-gray-700">{sys.examples}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-xs text-gray-500 font-medium mb-1">En vente :</p>
                <p className="text-sm text-gray-700 font-medium">{sys.sales}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-coral-500/5 border-l-4 border-brand-coral-500 p-4 rounded-r-lg">
          <h3 className="font-semibold text-brand-blue-700 mb-2">L&apos;insight clé pour les fondateurs</h3>
          <p className="text-gray-700 leading-relaxed mb-3">{THEORY_KAHNEMAN.keyInsight}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {THEORY_KAHNEMAN.actionItems.map((item, i) => (
              <div key={i} className="bg-white rounded-lg p-3">
                <p className="text-xs font-bold text-brand-coral-500 mb-1">{item.system}</p>
                <p className="text-sm text-gray-700">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
