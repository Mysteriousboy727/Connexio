"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("Register response:", { status: res.status, data });

      if (!res.ok) {
        setError(data.error || "Registration failed");
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
      console.error("Register error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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

      throw new Error("Google sign-up did not return a redirect URL");
    } catch (err) {
      console.error("Google sign-up error:", err);
      setError(err instanceof Error ? err.message : "Google sign-up failed");
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

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">c</span>
          </div>
          <span className="text-white font-bold text-xl">Connexio</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">Join Connexio and start connecting</p>
        </div>

        {/* Web3 Option */}
        <button
          type="button"
          onClick={handleGoogleRegister}
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
          <span className="text-gray-400 text-xs">or sign up with email</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                required
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">3-30 chars, letters/numbers/underscore</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
            />
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400 text-sm mb-6">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 font-semibold hover:text-cyan-300">
            Sign in
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs">
          © 2026 Connexio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
