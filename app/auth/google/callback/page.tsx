"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const finishGoogleAuth = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const accessToken = data.session?.access_token;
        if (!accessToken) {
          throw new Error("Google session not found after redirect");
        }

        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken }),
        });

        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload.error || "Google sign-in failed");
        }

        localStorage.setItem("token", payload.token);
        localStorage.setItem("user", JSON.stringify(payload.user));

        if (!cancelled) {
          router.replace("/");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Google sign-in failed");
        }
      }
    };

    finishGoogleAuth();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mb-4 flex items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">c</span>
          </div>
          <span className="text-white font-bold text-xl">Connexio</span>
        </div>

        <h1 className="text-2xl font-black text-white">Finishing Google sign-in</h1>
        <p className="mt-2 text-sm text-gray-400">
          We&apos;re connecting your Google account and preparing your profile.
        </p>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-left">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-3 text-sm text-cyan-300">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
            Redirecting you into the app...
          </div>
        )}
      </div>
    </div>
  );
}
