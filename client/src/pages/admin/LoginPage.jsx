import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setStoredUser } from "@/lib/api";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`;

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        // Server returned 4xx/5xx OR status: false
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("astoix_token", data.token);
      if (data.user) {
        setStoredUser({
          userName: data.user.userName,
          userEmail: data.user.userEmail,
          userType: data.user.userType,
        });
      }
      navigate("/admin");
    } catch {
      setError("Cannot reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06080f] flex items-center justify-center p-4 overflow-hidden">
      {/* ── Background layers ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-950/60 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full bg-violet-950/50 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Card ── */}
      <div
        className="relative w-full max-w-[400px] rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl shadow-2xl"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        {/* top accent line */}
        <div className="absolute top-0 left-8 right-8 h-[1px] rounded-full bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

        <div className="px-9 py-10">
          {/* ── Brand ── */}
          <div className="mb-8 flex flex-col items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600"
                style={{ boxShadow: "0 0 22px rgba(99,102,241,0.45)" }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M2 15L7.5 3.5H10.5L16 15H13.2L11.8 11.8H6.2L4.8 15H2ZM7.1 9.6H10.9L9 4.9L7.1 9.6Z"
                    fill="white"
                  />
                </svg>
              </div>
              <span
                className="text-[22px] font-semibold text-white"
                style={{
                  fontFamily: "'Outfit', 'Sora', sans-serif",
                  letterSpacing: "-0.04em",
                }}
              >
                ASTOIX
              </span>
            </div>

            <div className="mt-1">
              <h1
                className="text-2xl font-semibold text-white"
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-white/35 font-light">
                Sign in to your ASTOIX account
              </p>
            </div>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
              <svg
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-400 leading-snug">{error}</p>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot — keeps browser autofill away from real fields */}
            <input
              type="text"
              style={{ display: "none" }}
              aria-hidden="true"
              tabIndex={-1}
            />
            <input
              type="password"
              style={{ display: "none" }}
              aria-hidden="true"
              tabIndex={-1}
            />

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-medium tracking-wide text-white/45 uppercase"
              >
                Email
              </Label>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@astoix.com"
                  required
                  autoComplete="new-password"
                  value={email}
                  onChange={(e) => {
                    setError("");
                    setEmail(e.target.value);
                  }}
                  className="
                    h-11 pl-10 pr-4
                    rounded-xl border border-white/[0.08]
                    bg-white/[0.05] text-white
                    placeholder:text-white/20 text-sm
                    focus-visible:ring-1 focus-visible:ring-indigo-500/70
                    focus-visible:border-indigo-500/50
                    focus-visible:bg-indigo-950/20
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium tracking-wide text-white/45 uppercase"
              >
                Password
              </Label>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setError("");
                    setPassword(e.target.value);
                  }}
                  className="
                    h-11 pl-10 pr-11
                    rounded-xl border border-white/[0.08]
                    bg-white/[0.05] text-white
                    placeholder:text-white/20 text-sm
                    focus-visible:ring-1 focus-visible:ring-indigo-500/70
                    focus-visible:border-indigo-500/50
                    focus-visible:bg-indigo-950/20
                    transition-all duration-200
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="
                  relative w-full h-11 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-violet-600
                  hover:from-indigo-500 hover:to-violet-500
                  text-white text-sm font-medium
                  transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
                style={{ boxShadow: "0 4px 24px rgba(99,102,241,0.35)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-xs text-white/25">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Request access
            </a>
          </p>

          <div className="mt-5 flex items-center justify-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
              style={{ boxShadow: "0 0 6px rgba(52,211,153,0.7)" }}
            />
            <span className="text-[11px] text-white/20 tracking-wide">
              256-bit encrypted · Secured by ASTOIX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
