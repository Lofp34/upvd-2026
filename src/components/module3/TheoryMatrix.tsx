"use client";

import { THEORY_MATRIX } from "@/data/theory";

export function TheoryMatrix() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-blue-500 px-6 py-4">
        <p className="text-brand-coral-300 text-sm font-medium">Fiche 3.1</p>
        <h2 className="text-xl font-bold text-white">{THEORY_MATRIX.title}</h2>
      </div>

      <div className="p-6 space-y-6">
        {THEORY_MATRIX.sections.map((section, idx) => (
          <div key={idx}>
            {section.type === "insight" && (
              <div className="bg-brand-coral-500/5 border-l-4 border-brand-coral-500 p-4 rounded-r-lg">
                <h3 className="font-semibold text-brand-blue-700 mb-2">{section.title}</h3>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            )}
            {section.type === "concept" && section.items && (
              <div>
                <h3 className="font-semibold text-brand-blue-700 mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="font-bold text-brand-coral-500">{i + 1}.</span>
                      <div>
                        <span className="font-medium text-brand-blue-700">{item.label}</span>
                        <span className="text-gray-600">{" — "}{item.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div>
          <h3 className="font-semibold text-brand-blue-700 mb-3">Exemples concrets</h3>
          {THEORY_MATRIX.examples.map((ex, idx) => (
            <div key={idx} className="bg-brand-blue-50 rounded-lg p-4 mb-3">
              <p className="font-medium text-brand-blue-700 mb-2">{ex.stakeholder}</p>
              <table className="w-full text-sm">
                <tbody>
                  <tr>
                    <td className="py-1 pr-3 font-medium text-gray-500 align-top w-32">Enjeu apparent</td>
                    <td className="py-1 text-gray-700">{ex.apparent}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-3 font-medium text-gray-500 align-top">Enjeu profond</td>
                    <td className="py-1 text-gray-700">{ex.deep}</td>
                  </tr>
                  <tr>
                    <td className="py-1 pr-3 font-medium text-gray-500 align-top">Pont</td>
                    <td className="py-1 text-gray-700 italic">{ex.bridge}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">{THEORY_MATRIX.perception.title}</h3>
          <ul className="space-y-2">
            {THEORY_MATRIX.perception.points.map((point, i) => (
              <li key={i} className="text-sm text-amber-900 flex gap-2">
                <span className="text-amber-500 mt-0.5">&#9679;</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
