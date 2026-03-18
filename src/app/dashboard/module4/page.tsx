"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressBar } from "@/components/layout/ProgressBar";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import { BIASES } from "@/data/biases";

interface StakeholderFull {
  id: string;
  name: string;
  role: string;
  category: string;
  priority: string;
  matrix: { apparentStake: string; deepStake: string; bridge: string }[];
  biasApplications: { biasName: string; application: string }[];
}

interface StartupFull {
  id: string;
  startupName: string;
  founderName: string;
  sector: string | null;
  stage: string | null;
  stakeholders: StakeholderFull[];
}

export default function Module4Page() {
  const { startup, refreshStartup } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<StartupFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async () => {
    if (!startup) return;
    try {
      const res = await fetch(`/api/startups/${startup.id}`);
      const json = await res.json();
      setData(json.startup);
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

  const completionStatus = {
    module1Complete: startup.module1Complete,
    module2Complete: startup.module2Complete,
    module3Complete: startup.module3Complete,
    module4Complete: startup.module4Complete,
  };

  if (loading || !data) {
    return (
      <div>
        <ProgressBar currentModule={4} completionStatus={completionStatus} />
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      </div>
    );
  }

  const stakeholders = data.stakeholders || [];
  const totalStakeholders = stakeholders.length;
  const categoriesUsed = new Set(stakeholders.map((s) => s.category)).size;
  const matrixComplete = stakeholders.filter((s) => {
    const m = s.matrix?.[0];
    return m && m.apparentStake.trim() && m.deepStake.trim() && m.bridge.trim();
  }).length;
  const withBiases = stakeholders.filter((s) => s.biasApplications?.length > 0).length;

  const groupedStakeholders = CATEGORIES.map((cat) => ({
    ...cat,
    stakeholders: stakeholders.filter((s) => s.category === cat.id),
  })).filter((g) => g.stakeholders.length > 0);

  async function handleExport() {
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("bible-pdf-content");
      if (!element) return;

      element.style.display = "block";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (html2pdf() as any)
        .set({
          margin: 10,
          filename: `bible-commerciale-${data!.startupName.toLowerCase().replace(/\s+/g, "-")}-session1.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(element)
        .save();

      element.style.display = "none";

      // Mark module 4 as complete
      await fetch(`/api/startups/${startup!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module4Complete: true }),
      });
      await refreshStartup();
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setExporting(false);
    }
  }

  const priorityColor = (p: string) => {
    if (p === "critique") return "#EF4444";
    if (p === "important") return "#F59E0B";
    return "#6B7280";
  };

  return (
    <div>
      <ProgressBar currentModule={4} completionStatus={completionStatus} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-blue-700">
            Ma Bible Commerciale — Session 1
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Voici la synthèse de ton travail. Exporte ta Bible en PDF.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Parties prenantes" value={totalStakeholders} />
          <StatCard label="Catégories couvertes" value={`${categoriesUsed}/6`} />
          <StatCard label="Matrices complètes" value={matrixComplete} />
          <StatCard label="Avec biais identifiés" value={withBiases} />
        </div>

        {/* Stakeholder Visual */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-brand-blue-700 mb-4">Carte des parties prenantes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {groupedStakeholders.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span>{group.icon}</span>
                  <span className="text-sm font-medium text-brand-blue-700">{group.label}</span>
                </div>
                <div className="space-y-1">
                  {group.stakeholders.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: priorityColor(s.priority) }}
                      />
                      <span className="text-gray-700 truncate">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-brand-blue-700 mb-4">Matrice des enjeux</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Partie prenante</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Enjeu apparent</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Enjeu profond</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Pont</th>
                </tr>
              </thead>
              <tbody>
                {stakeholders.map((s) => {
                  const m = s.matrix?.[0];
                  return (
                    <tr key={s.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-medium text-brand-blue-700">
                        {s.name}
                        <span className="text-xs text-gray-400 block">{s.role}</span>
                      </td>
                      <td className="py-2 px-3 text-gray-600">{m?.apparentStake || "—"}</td>
                      <td className="py-2 px-3 text-gray-600">{m?.deepStake || "—"}</td>
                      <td className="py-2 px-3 text-gray-600">{m?.bridge || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export button */}
        <div className="text-center py-6">
          <Button size="lg" onClick={handleExport} disabled={exporting}>
            {exporting ? "Génération du PDF..." : "Exporter ma Bible — Session 1"}
          </Button>
          <div className="mt-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")}>
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden PDF content */}
      <div id="bible-pdf-content" style={{ display: "none" }}>
        <div style={{ fontFamily: "Arial, sans-serif", padding: "40px", color: "#1E3A5F" }}>
          {/* Cover */}
          <div style={{ textAlign: "center", marginBottom: "60px", paddingTop: "100px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}>
              Bible Commerciale
            </h1>
            <h2 style={{ fontSize: "24px", color: "#FF6B4A", marginBottom: "20px" }}>
              {data.startupName}
            </h2>
            <p style={{ fontSize: "16px", color: "#666" }}>
              Session 1 : Les Fondations de la Conviction
            </p>
            <p style={{ fontSize: "14px", color: "#999", marginTop: "20px" }}>
              {data.founderName} — {data.sector || ""} — {data.stage || ""}
            </p>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "10px" }}>
              {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p style={{ fontSize: "12px", color: "#ccc", marginTop: "40px" }}>
              Incubateur UPVD
            </p>
          </div>

          <div style={{ pageBreakBefore: "always" }} />

          {/* Stakeholder Map */}
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #FF6B4A", paddingBottom: "8px" }}>
            Carte des parties prenantes
          </h2>
          {groupedStakeholders.map((group) => (
            <div key={group.id} style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#FF6B4A", marginBottom: "8px" }}>
                {group.icon} {group.label}
              </h3>
              {group.stakeholders.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", paddingLeft: "16px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: priorityColor(s.priority), display: "inline-block" }} />
                  <span style={{ fontSize: "13px" }}>{s.name}</span>
                  <span style={{ fontSize: "11px", color: "#999" }}>{s.role}</span>
                </div>
              ))}
            </div>
          ))}

          <div style={{ pageBreakBefore: "always" }} />

          {/* Matrix */}
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #FF6B4A", paddingBottom: "8px" }}>
            Matrice des enjeux
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
            <thead>
              <tr style={{ backgroundColor: "#1E3A5F", color: "white" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Partie prenante</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Priorité</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Enjeu apparent</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Enjeu profond</th>
                <th style={{ padding: "8px", textAlign: "left" }}>Pont</th>
              </tr>
            </thead>
            <tbody>
              {stakeholders.map((s, i) => {
                const m = s.matrix?.[0];
                return (
                  <tr key={s.id} style={{ backgroundColor: i % 2 === 0 ? "#f8fafc" : "white", borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>{s.name}<br /><span style={{ fontWeight: "normal", color: "#999", fontSize: "10px" }}>{s.role}</span></td>
                    <td style={{ padding: "8px", color: priorityColor(s.priority), fontWeight: "bold", textTransform: "capitalize" }}>{s.priority}</td>
                    <td style={{ padding: "8px" }}>{m?.apparentStake || "—"}</td>
                    <td style={{ padding: "8px" }}>{m?.deepStake || "—"}</td>
                    <td style={{ padding: "8px" }}>{m?.bridge || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ pageBreakBefore: "always" }} />

          {/* Bias Applications */}
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px", borderBottom: "2px solid #FF6B4A", paddingBottom: "8px" }}>
            Leviers cognitifs identifiés
          </h2>
          {stakeholders
            .filter((s) => s.biasApplications?.length > 0)
            .map((s) => (
              <div key={s.id} style={{ marginBottom: "16px", padding: "12px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>{s.name}</h3>
                {s.biasApplications.map((ba, i) => {
                  const bias = BIASES.find((b) => b.id === ba.biasName);
                  return (
                    <div key={i} style={{ marginBottom: "6px", paddingLeft: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "bold", color: "#FF6B4A" }}>
                        {bias?.name || ba.biasName}
                      </span>
                      <p style={{ fontSize: "12px", color: "#666", margin: "2px 0 0 0" }}>
                        {ba.application || "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* Teaser */}
          <div style={{ pageBreakBefore: "always", textAlign: "center", paddingTop: "100px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1E3A5F", marginBottom: "20px" }}>
              À venir...
            </h2>
            <div style={{ fontSize: "14px", color: "#666", lineHeight: "2" }}>
              <p>Session 2 : Les Ponts d&apos;Enjeux</p>
              <p>Session 3 : Les Canaux d&apos;Accès</p>
              <p>Session 4 : Structurer l&apos;Entretien</p>
              <p>Session 5-6 : La Découverte & La Maïeutique</p>
              <p>Session 7 : Argumentation, Objections & Closing</p>
              <p>Sessions 8-9 : S&apos;adapter aux profils (DISC)</p>
              <p>Session 10 : Synthèse complète</p>
            </div>
            <p style={{ fontSize: "16px", color: "#FF6B4A", marginTop: "40px", fontWeight: "bold" }}>
              Tu as posé les fondations. Continue à construire ta conviction !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold text-brand-coral-500">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}
