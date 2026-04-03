"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", { status: res.status, data });

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (!data.token) {
        setError("No token received from server");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/google/callback`;

      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (googleError) {
        throw googleError;
      }

      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      throw new Error("Google sign-in did not return a redirect URL");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Globe Background */}
      <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center pointer-events-none opacity-40">
        <svg
          className="w-96 h-96 animate-pulse"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="48" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.5" />
          <circle cx="50" cy="50" r="42" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.3" />
          <circle cx="50" cy="50" r="36" stroke="url(#grad1)" strokeWidth="0.5" opacity="0.2" />
          
          {/* Dot pattern for globe effect */}
          {[
            { x: 55, y: 35 }, { x: 45, y: 40 }, { x: 65, y: 45 }, { x: 35, y: 55 },
            { x: 60, y: 60 }, { x: 40, y: 65 }, { x: 70, y: 50 }, { x: 30, y: 45 },
            { x: 50, y: 30 }, { x: 58, y: 58 }, { x: 42, y: 52 }, { x: 68, y: 65 },
            { x: 32, y: 68 }, { x: 48, y: 75 }, { x: 72, y: 35 }, { x: 28, y: 35 },
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r="1"
              fill="currentColor"
              className="text-cyan-400 opacity-70"
            />
          ))}
          
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Left Content */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-12 relative z-10">
        {/* Form Section */}
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">c</span>
            </div>
            <span className="text-white font-bold text-xl">Connexio</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Login</h1>
            <p className="text-gray-400 text-sm">Access your digital assets</p>
          </div>

          {/* Web3 Login Option */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-900 font-semibold py-3 rounded-lg mb-6 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M21.805 10.023H12v3.955h5.617c-.242 1.272-.967 2.35-2.058 3.074v2.553h3.327c1.947-1.793 3.069-4.437 3.069-7.582 0-.672-.06-1.318-.15-2Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.79 0 5.13-.925 6.84-2.395l-3.327-2.553c-.924.62-2.106.986-3.513.986-2.699 0-4.984-1.822-5.8-4.271H2.76v2.632A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.2 13.767A5.998 5.998 0 0 1 5.876 12c0-.614.11-1.21.324-1.767V7.6H2.76A10 10 0 0 0 2 12c0 1.61.386 3.135 1.07 4.4l3.13-2.633Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.962c1.52 0 2.884.523 3.958 1.548l2.967-2.967C17.125 2.866 14.787 2 12 2A10 10 0 0 0 2.76 7.6l3.44 2.633c.814-2.451 3.1-4.27 5.8-4.27Z"
              />
            </svg>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-600" />
            <span className="text-gray-400 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-600" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-cyan-500" />
                Remember me
              </label>
              <button type="button" className="text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-all mt-6"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-cyan-400 font-semibold hover:text-cyan-300">
              Sign up
            </Link>
          </p>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-8">
            © 2026 Connexio. All rights reserved.
          </p>
        </div>

        {/* Right Side - Globe Visualization */}
        <div className="hidden lg:flex flex-1 justify-center items-center h-96">
          <svg
            className="w-full max-w-md animate-spin-slow"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animationDuration: "20s" }}
          >
            {/* Outer circles */}
            <circle cx="100" cy="100" r="95" stroke="url(#gradient)" strokeWidth="1" opacity="0.3" />
            <circle cx="100" cy="100" r="85" stroke="url(#gradient)" strokeWidth="1" opacity="0.2" />
            <circle cx="100" cy="100" r="75" stroke="url(#gradient)" strokeWidth="1" opacity="0.1" />

            {/* Grid lines */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="url(#gradient)" strokeWidth="0.5" opacity="0.2" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="url(#gradient)" strokeWidth="0.5" opacity="0.2" />

            {/* Randomly distributed glowing points */}
            {[
              { x: 120, y: 60 }, { x: 80, y: 50 }, { x: 140, y: 100 }, { x: 60, y: 120 },
              { x: 100, y: 30 }, { x: 150, y: 140 }, { x: 50, y: 80 }, { x: 170, y: 110 },
              { x: 30, y: 100 }, { x: 110, y: 160 }, { x: 160, y: 70 }, { x: 70, y: 150 },
              { x: 130, y: 130 }, { x: 90, y: 40 }, { x: 50, y: 50 }, { x: 140, y: 160 },
              { x: 75, y: 75 }, { x: 125, y: 85 }, { x: 95, y: 145 }, { x: 65, y: 110 },
            ].map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  fill="url(#gradient)"
                  opacity="0.8"
                  className="animate-pulse"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </g>
            ))}

            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* CSS for slow spin animation */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
