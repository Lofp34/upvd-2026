"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { startup, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand-blue-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!startup) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-brand-blue-500">
              Bible Commerciale
            </h1>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm font-medium text-brand-blue-700">
              {startup.startupName}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{startup.founderName}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
