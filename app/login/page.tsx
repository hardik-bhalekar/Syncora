"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getDashboardHomePath } from "@/lib/rbac"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <main className="editorial-canvas py-24 flex-1 flex flex-col justify-center items-center">
      <div className="wireframe-box w-full max-w-lg">
        <div className="cinematic-kicker">
          <span className="signal-dot signal-dot-ochre" />
          Authentication Gateway
        </div>

        <h1 className="editorial-headline mt-4 text-3xl">
          Enterprise <span className="editorial-headline-italic">Access</span>.
        </h1>

        <p className="prose-restrained mt-4 text-sm">
          Foundational reset state. Enter your role credentials below to access the unstyled core dashboard routing.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="telemetry-mono block" htmlFor="email">EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              className="w-full bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] p-3 text-[var(--color-alabaster-stark)] font-mono text-sm focus:outline-none focus:border-[var(--color-signal-cerulean)]"
            />
          </div>

          <div className="space-y-2">
            <label className="telemetry-mono block" htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] p-3 text-[var(--color-alabaster-stark)] font-mono text-sm focus:outline-none focus:border-[var(--color-signal-cerulean)]"
            />
          </div>

          {error && (
            <div className="p-3 bg-[var(--color-signal-crimson)]/20 border border-[var(--color-signal-crimson)] text-[var(--color-signal-crimson)] font-mono text-xs">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-alabaster-base)] text-[var(--color-graphite-base)] font-mono text-xs font-bold py-3 px-4 hover:bg-[var(--color-alabaster-stark)] transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN [SECURE_GATEWAY]"}
          </button>
        </form>

        <div className="hairline-rule my-6" />

        <div className="space-y-2 telemetry-mono text-xs">
          <div className="text-[var(--color-alabaster-muted)] mb-2">FOUNDATIONAL DEMO CREDENTIALS:</div>
          <div className="flex justify-between"><span className="text-[var(--color-signal-ochre)]">Admin:</span><span>admin@test.com / admin123</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-signal-cerulean)]">Manager:</span><span>manager@test.com / manager123</span></div>
          <div className="flex justify-between"><span className="text-[var(--color-signal-emerald)]">Employee:</span><span>employee@test.com / employee123</span></div>
        </div>

        <div className="mt-8 pt-4 border-t border-[var(--hairline-base)] text-center">
          <Link href="/" className="telemetry-mono text-[var(--color-alabaster-muted)] hover:text-[var(--color-alabaster-stark)] text-xs">
            ← RETURN TO LANDING WIREFRAME
          </Link>
        </div>
      </div>
    </main>
  )
}