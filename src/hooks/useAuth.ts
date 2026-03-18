"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface StartupSession {
  id: string;
  startupName: string;
  founderName: string;
  sector: string | null;
  stage: string | null;
  module1Complete: boolean;
  module2Complete: boolean;
  module3Complete: boolean;
  module4Complete: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [startup, setStartup] = useState<StartupSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.startup) {
          setStartup(data.startup);
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const refreshStartup = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.startup) {
        setStartup(data.startup);
      }
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  }, [router]);

  return { startup, loading, logout, refreshStartup };
}
