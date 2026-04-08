"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/learn";
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* SVG decoration */}
      <svg
        className="absolute -top-8 -right-12 opacity-20 pointer-events-none"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="36" fill="var(--color-ocean)" />
        <polygon
          points="85,20 110,75 60,75"
          fill="var(--color-saffron)"
        />
      </svg>
      <svg
        className="absolute -bottom-6 -left-10 opacity-15 pointer-events-none"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="40" cy="40" r="32" fill="var(--color-ocean)" />
      </svg>

      {/* Wordmark */}
      <h1 className="font-serif text-3xl font-bold text-ink mb-8">Codex</h1>

      {/* Card */}
      <div className="w-full bg-linen rounded-2xl shadow-sm p-8">
        <h2 className="font-serif text-xl font-semibold text-ink text-center mb-6">
          Welcome back
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-vermillion/10 text-vermillion text-sm px-4 py-2.5 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-graphite mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone bg-snow px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:border-ocean transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-graphite mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone bg-snow px-4 py-2.5 text-ink placeholder:text-graphite/50 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:border-ocean transition-colors"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ocean text-white font-medium py-2.5 hover:bg-ocean/90 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-linen px-3 text-graphite">or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/learn" })}
          className="w-full rounded-xl border border-stone bg-snow text-ink font-medium py-2.5 hover:bg-stone/30 focus:outline-none focus:ring-2 focus:ring-ocean/40 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
              fill="#4285F4"
            />
            <path
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.71.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.3H1.83v2.07A8 8 0 0 0 8.98 17z"
              fill="#34A853"
            />
            <path
              d="M4.51 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.68-2.07z"
              fill="#FBBC05"
            />
            <path
              d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4l2.68 2.07c.63-1.9 2.4-3.3 4.47-3.3z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <p className="mt-6 text-sm text-graphite text-center">
        New to Codex?{" "}
        <Link
          href="/signup"
          className="text-ocean font-medium hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
