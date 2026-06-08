"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Registration failed. Please try again.");
    } else {
      router.push("/login?registered=true");
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"][passwordStrength];

  return (
    <main className="min-h-screen bg-zinc-950 flex">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-zinc-900 flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-900 to-transparent" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-black">T</span>
          </div>
          <span className="text-white font-semibold">ThreadShop</span>
        </div>

        <div className="relative space-y-5">
          {[
            { icon: "✦", text: "Access your order history and chat history" },
            { icon: "✦", text: "Shop faster with saved preferences" },
            { icon: "✦", text: "Request unavailable sizes on your behalf" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-zinc-600 text-sm mt-0.5">{item.icon}</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center">
            <span className="text-zinc-950 text-xs font-black">T</span>
          </div>
          <span className="text-white font-semibold text-sm">ThreadShop</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1.5">Create an account</h1>
            <p className="text-zinc-500 text-sm">Join to start shopping smarter</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
              <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full name</label>
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Safaet Ahmed"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900 border border-white/8 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/8 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-zinc-900 border border-white/8 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-all"
              />
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${i <= passwordStrength ? strengthColor : "bg-zinc-800"}`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/8 text-white text-sm rounded-xl px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-white/25 focus:ring-1 focus:ring-white/10 transition-all"
                />
                {form.confirm && form.password === form.confirm && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-zinc-950 font-semibold text-sm py-3 rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all duration-150 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-300 hover:text-white transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
