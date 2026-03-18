"use client";

import { BIASES } from "@/data/biases";

export function TheoryBiases() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-blue-500 px-6 py-4">
        <p className="text-brand-coral-300 text-sm font-medium">Fiche 2.2</p>
        <h2 className="text-xl font-bold text-white">
          Les 8 biais cognitifs qui font (ou défont) tes ventes
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {BIASES.map((bias, idx) => (
          <div key={bias.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 bg-brand-coral-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <h3 className="font-semibold text-brand-blue-700">{bias.name}</h3>
            </div>
            <p className="text-gray-700 text-sm mb-2">{bias.definition}</p>
            <div className="bg-gray-50 rounded-lg p-3 mb-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Exemple startup :</p>
              <p className="text-sm text-gray-700">{bias.example}</p>
            </div>
            <div className="bg-brand-coral-500/5 rounded-lg p-3">
              <p className="text-xs text-brand-coral-600 font-medium mb-1">Levier :</p>
              <p className="text-sm text-gray-700 font-medium">{bias.lever}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
