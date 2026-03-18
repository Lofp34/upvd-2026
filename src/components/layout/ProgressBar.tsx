"use client";

import { MODULES } from "@/lib/constants";

interface ProgressBarProps {
  currentModule: number;
  completionStatus: {
    module1Complete: boolean;
    module2Complete: boolean;
    module3Complete: boolean;
    module4Complete: boolean;
  };
}

export function ProgressBar({ currentModule, completionStatus }: ProgressBarProps) {
  const statusMap: Record<number, boolean> = {
    1: completionStatus.module1Complete,
    2: completionStatus.module2Complete,
    3: completionStatus.module3Complete,
    4: completionStatus.module4Complete,
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          {MODULES.map((mod, idx) => {
            const isActive = currentModule === mod.id;
            const isComplete = statusMap[mod.id];
            const isPast = mod.id < currentModule;

            return (
              <div key={mod.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isComplete
                        ? "bg-brand-blue-500 text-white"
                        : isActive
                        ? "bg-brand-coral-500 text-white"
                        : isPast
                        ? "bg-brand-blue-200 text-brand-blue-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isComplete ? "\u2713" : mod.id}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={`text-xs font-medium ${
                        isActive ? "text-brand-coral-500" : isComplete || isPast ? "text-brand-blue-500" : "text-gray-400"
                      }`}
                    >
                      {mod.title}
                    </p>
                  </div>
                </div>
                {idx < MODULES.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 ${
                      isComplete || isPast ? "bg-brand-blue-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
