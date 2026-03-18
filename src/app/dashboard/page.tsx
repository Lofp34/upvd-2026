"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { MODULES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { startup } = useAuth();
  const router = useRouter();

  if (!startup) return null;

  const statusMap: Record<number, boolean> = {
    1: startup.module1Complete,
    2: startup.module2Complete,
    3: startup.module3Complete,
    4: startup.module4Complete,
  };

  function canAccess(moduleId: number): boolean {
    if (moduleId === 1) return true;
    // Module 2 requires module 1
    if (moduleId === 2) return statusMap[1];
    // Module 3 requires module 1 (skip 2 for flexibility)
    if (moduleId === 3) return statusMap[1];
    // Module 4 requires module 3
    if (moduleId === 4) return statusMap[3];
    return false;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-brand-blue-700 mb-2">
          Session 1 : Les Fondations de la Conviction
        </h2>
        <p className="text-gray-600">
          Bienvenue {startup.founderName} ! Parcours les 4 modules pour construire ta Bible Commerciale.
        </p>
      </div>

      <div className="grid gap-4">
        {MODULES.map((mod) => {
          const complete = statusMap[mod.id];
          const accessible = canAccess(mod.id);

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                complete
                  ? "border-green-200 bg-green-50/30"
                  : accessible
                  ? "border-brand-coral-200 hover:border-brand-coral-400 hover:shadow-md cursor-pointer"
                  : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      complete
                        ? "bg-green-500 text-white"
                        : accessible
                        ? "bg-brand-coral-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {complete ? "\u2713" : mod.id}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-blue-700">
                      Module {mod.id} — {mod.title}
                    </h3>
                    <p className="text-sm text-gray-500">{mod.subtitle}</p>
                  </div>
                </div>
                <Button
                  variant={complete ? "outline" : "primary"}
                  size="sm"
                  disabled={!accessible}
                  onClick={() => router.push(mod.path)}
                >
                  {complete ? "Revoir" : accessible ? "Commencer" : "Verrouillé"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
