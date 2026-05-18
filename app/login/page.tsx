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
          Enterprise Sign-In
        </div>

        <h1 className="editorial-headline mt-4 text-3xl">Sign in</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label className="telemetry-mono block" htmlFor="email">WORK EMAIL</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@company.com"
              className="w-full bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)] p-3 text-[var(--color-alabaster-stark)] font-mono text-sm focus:outline-none focus:border-[var(--color-signal-cerulean)]"
            />
          </div>

          <div className="space-y-2">
            <label className="telemetry-mono block" htmlFor="password">ACCESS KEY</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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
            {loading ? "AUTHENTICATING..." : "CONTINUE TO WORKSPACE"}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[var(--hairline-base)] text-center">
          <Link href="/" className="telemetry-mono text-[var(--color-alabaster-muted)] hover:text-[var(--color-alabaster-stark)] text-xs">
            RETURN TO LANDING PAGE
          </Link>
        </div>
      </div>
    </main>
  )
}
