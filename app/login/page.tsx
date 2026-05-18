"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaMicrosoft, FaGoogle, FaGithub } from "react-icons/fa"
import { getDashboardHomePath } from "@/lib/rbac"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleOAuthSignIn = (provider: string) => {
    setError(null)
    setLoadingProvider(provider)
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (result?.error) {
      setError("Invalid credentials.")
      setLoading(false)
      return
    }

    const session = await getSession()
    router.replace(getDashboardHomePath(session?.user?.role))
    router.refresh()
  }

  const quickFill = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword("Demo@123")
  }

  return (
    <main className="editorial-canvas py-16 flex-1 flex flex-col justify-center items-center px-4">
      <div className="wireframe-box w-full max-w-lg bg-[var(--color-graphite-elevated)]/40 backdrop-blur-md border border-[var(--hairline-strong)] p-8 shadow-2xl">
        <div className="cinematic-kicker flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="signal-dot signal-dot-ochre" />
            <span className="tracking-widest font-mono text-xs text-[var(--color-alabaster-muted)]">ENTERPRISE SSO ACTIVE</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[var(--color-signal-cerulean)]/20 text-[var(--color-signal-cerulean)] border border-[var(--color-signal-cerulean)]/40 uppercase">
            Entra ID Ready
          </span>
        </div>

        <h1 className="editorial-headline mt-6 text-3xl font-light text-[var(--color-alabaster-stark)]">
          Sign in to Syncora
        </h1>
        <p className="mt-2 text-xs font-mono text-[var(--color-alabaster-muted)]">
          Select your enterprise identity provider or continue with credentials.
        </p>

        {/* OAuth Providers */}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleOAuthSignIn("azure-ad")}
            disabled={loadingProvider !== null || loading}
            className="w-full flex items-center justify-between bg-[#0078D4]/10 border border-[#0078D4]/40 hover:bg-[#0078D4]/20 text-[var(--color-alabaster-stark)] p-3.5 transition-all cursor-pointer disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <FaMicrosoft className="text-lg text-[#0078D4] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm font-medium">Continue with Microsoft</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0078D4]/20 text-[#0078D4] border border-[#0078D4]/30">
              Admin Preferred
            </span>
          </button>

          <button
            onClick={() => handleOAuthSignIn("google")}
            disabled={loadingProvider !== null || loading}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-white/10 text-[var(--color-alabaster-stark)] p-3.5 transition-all cursor-pointer disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <FaGoogle className="text-lg text-[#4285F4] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm font-medium">Continue with Google</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-[var(--color-alabaster-muted)] border border-white/10">
              Employee SSO
            </span>
          </button>

          <button
            onClick={() => handleOAuthSignIn("github")}
            disabled={loadingProvider !== null || loading}
            className="w-full flex items-center justify-between bg-[#24292e]/40 border border-[#24292e] hover:bg-[#24292e]/80 text-[var(--color-alabaster-stark)] p-3.5 transition-all cursor-pointer disabled:opacity-50 group"
          >
            <div className="flex items-center gap-3">
              <FaGithub className="text-lg text-white group-hover:scale-110 transition-transform" />
              <span className="font-mono text-sm font-medium">Continue with GitHub</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-[var(--color-alabaster-muted)] border border-white/10">
              Judges / Devs
            </span>
          </button>

          {loadingProvider && (
            <div className="text-center py-2 text-xs font-mono text-[var(--color-signal-cerulean)] animate-pulse">
              Redirecting to {loadingProvider.toUpperCase()} Secure Login...
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="h-[1px] flex-1 bg-[var(--hairline-strong)]" />
          <span className="font-mono text-[10px] text-[var(--color-alabaster-muted)] tracking-wider uppercase">
            Or continue with credentials
          </span>
          <div className="h-[1px] flex-1 bg-[var(--hairline-strong)]" />
        </div>

        {/* Quick Fill Demo Badges */}
        <div className="mb-6 bg-[var(--color-graphite-elevated)] p-3 border border-[var(--hairline-base)]">
          <div className="text-[10px] font-mono text-[var(--color-alabaster-muted)] mb-2 uppercase tracking-wider">
            ⚡ Quick Demo Credentials Fill:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => quickFill("labop69@gmail.com")}
              className="text-xs font-mono px-2.5 py-1 bg-[var(--color-signal-cerulean)]/20 border border-[var(--color-signal-cerulean)] text-[var(--color-signal-cerulean)] hover:bg-[var(--color-signal-cerulean)]/30 transition-colors cursor-pointer font-bold"
            >
              labop69@gmail.com (Admin)
            </button>
            <button
              type="button"
              onClick={() => quickFill("admin@syncora.com")}
              className="text-xs font-mono px-2.5 py-1 bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] hover:border-[var(--color-signal-cerulean)] text-[var(--color-alabaster-stark)] transition-colors cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => quickFill("manager@syncora.com")}
              className="text-xs font-mono px-2.5 py-1 bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] hover:border-[var(--color-signal-cerulean)] text-[var(--color-alabaster-stark)] transition-colors cursor-pointer"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => quickFill("employee@syncora.com")}
              className="text-xs font-mono px-2.5 py-1 bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] hover:border-[var(--color-signal-cerulean)] text-[var(--color-alabaster-stark)] transition-colors cursor-pointer"
            >
              Employee
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="telemetry-mono block text-xs" htmlFor="email">WORK EMAIL</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              className="w-full bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] p-3 text-[var(--color-alabaster-stark)] font-mono text-sm focus:outline-none focus:border-[var(--color-signal-cerulean)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="telemetry-mono block text-xs" htmlFor="password">ACCESS KEY</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] p-3 text-[var(--color-alabaster-stark)] font-mono text-sm focus:outline-none focus:border-[var(--color-signal-cerulean)] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-[var(--color-signal-crimson)]/20 border border-[var(--color-signal-crimson)] text-[var(--color-signal-crimson)] font-mono text-xs animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || loadingProvider !== null}
            className="w-full bg-[var(--color-alabaster-base)] text-[var(--color-graphite-base)] font-mono text-xs font-bold py-3 px-4 hover:bg-[var(--color-alabaster-stark)] transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "CONTINUE TO WORKSPACE"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[var(--hairline-base)] text-center">
          <Link href="/" className="telemetry-mono text-[var(--color-alabaster-muted)] hover:text-[var(--color-alabaster-stark)] text-xs transition-colors">
            RETURN TO LANDING PAGE
          </Link>
        </div>
      </div>
    </main>
  )
}
