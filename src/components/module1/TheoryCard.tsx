"use client";

import { THEORY_MODULE1 } from "@/data/theory";

export function TheoryCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-blue-500 px-6 py-4">
        <p className="text-brand-coral-300 text-sm font-medium">Fiche 1.1</p>
        <h2 className="text-xl font-bold text-white">{THEORY_MODULE1.title}</h2>
      </div>

      <div className="p-6 space-y-6">
        {THEORY_MODULE1.sections.map((section, idx) => (
          <div key={idx}>
            {section.type === "insight" && (
              <div className="bg-brand-coral-500/5 border-l-4 border-brand-coral-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-brand-blue-700 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            )}

            {section.type === "concept" && (
              <div>
                <h3 className="font-semibold text-brand-blue-700 mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            )}

            {section.type === "list" && (
              <div>
                <h3 className="font-semibold text-brand-blue-700 mb-3">
                  {section.title}
                </h3>
                <div className="grid gap-2">
                  {section.items!.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <span className="font-bold text-brand-coral-500">
                        {i + 1}.
                      </span>
                      <div>
                        <span className="font-medium text-brand-blue-700">
                          {item.label}
                        </span>
                        <span className="text-gray-600">
                          {" — "}
                          {item.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
