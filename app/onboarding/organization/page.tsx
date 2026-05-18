"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { getDashboardHomePath } from "@/lib/rbac";

interface SuccessOrg {
  id: string;
  name: string;
  domain?: string | null;
  plan: string;
}

export default function OrganizationOnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState("ENTERPRISE");
  const [cadence, setCadence] = useState("A24_CINEMATIC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SuccessOrg | null>(null);

  let shaHash = "STANDBY | AWAITING INPUT";
  if (name || domain) {
    const combined = `${name}:${domain}:${plan}:${cadence}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    shaHash = `sync_${hex}...${plan.toLowerCase().substring(0, 3)}`;
  }

  const activeShard = "US-EAST-1 | SPATIAL A";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain, plan, cadence }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to initialize organization tenancy.");
        setLoading(false);
        return;
      }

      setSuccessData(data.data as SuccessOrg);
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected network error occurred.");
      }
      setLoading(false);
    }
  };

  const handleEnterWorkspace = async () => {
    const session = await getSession();
    const destination = getDashboardHomePath(session?.user?.role);
    router.replace(destination);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-main)] flex flex-col relative overflow-x-hidden selection:bg-[var(--color-accent-primary)] selection:text-white">
      {/* Cinematic Depth Shaders & Ambient Glows */}
      <div className="ambient-glow-primary top-10 left-10" />
      <div className="ambient-glow-primary bottom-10 right-10 opacity-40" />
      <div className="depth-fog-top" />
      <div className="depth-fog-bottom" />

      {/* --- TOP NAVIGATION GATEWAY --- */}
      <header className="relative z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/60 backdrop-blur-2xl">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 h-24 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[var(--color-accent-primary)] shadow-[0_0_15px_rgba(255,75,145,0.8)]" />
            <span className="font-bold tracking-widest uppercase text-sm">SYNCORA</span>
            <span className="text-[var(--color-text-dimmed)] hidden md:inline border-l border-[var(--color-border)] pl-4 ml-2">
              {"Tenant Initialization Gateway"}
            </span>
          </div>

          <div className="flex items-center gap-8 text-[var(--color-text-muted)] hidden sm:flex">
            <span>{"ENCRYPTION: AES-256-GCM"}</span>
            <span>{"RLS_ISOLATION: ENFORCED"}</span>
          </div>

          <Link href="/login" className="text-[var(--color-text-dimmed)] hover:text-[var(--color-text-main)] transition-colors">
            ← ABORT TO GATEWAY
          </Link>
        </div>
      </header>

      {/* --- MAIN ONBOARDING CANVAS --- */}
      <div className="max-w-[1440px] w-full mx-auto px-8 md:px-16 py-16 flex-1 flex flex-col justify-center relative z-10">
        {!successData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Interactive Form & Configuration */}
            <StaggerGroup className="lg:col-span-7 space-y-12">
              <StaggerItem>
                <div className="cinematic-kicker">
                  <span className="signal-dot signal-dot-primary" />
                  {"Step 01 | Architectural Identity"}
                </div>
                <h1 className="text-cinematic-h1 leading-tight mt-3">
                  Establish Organization <br />
                  <span className="text-cinematic-italic text-[var(--color-accent-primary)]">Tenancy</span>.
                </h1>
                <p className="text-editorial-body mt-4 max-w-xl">
                  Configure your dedicated enterprise workspace. Syncora provisions an isolated database shard with strict Row-Level Security (RLS) guarantees and custom alignment telemetry.
                </p>
              </StaggerItem>

              <StaggerItem>
                <form onSubmit={handleSubmit} className="space-y-10">
                  {/* Section 1: Basic Identity */}
                  <div className="space-y-6 p-8 bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)]">
                    <div className="border-b border-[var(--color-border)] pb-4 flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--color-accent-primary)] font-bold">Tenant Metadata</span>
                      <span className="text-[var(--color-text-dimmed)]">REQUIRED</span>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="name" className="telemetry-label block">ORGANIZATION NAME</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Acme Intelligence Corp"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border-strong)] p-4 text-[var(--color-text-main)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors shadow-[var(--shadow-subtle)]"
                      />
                      <p className="font-mono text-[11px] text-[var(--color-text-dimmed)]">
                        The formal designation utilized across executive reports and audit logs.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label htmlFor="domain" className="telemetry-label block">PRIMARY DOMAIN (OPTIONAL)</label>
                      <input
                        id="domain"
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. acme-ai.com"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border-strong)] p-4 text-[var(--color-text-main)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors shadow-[var(--shadow-subtle)]"
                      />
                      <p className="font-mono text-[11px] text-[var(--color-text-dimmed)]">
                        Enables seamless SAML/SSO discovery and automated employee onboarding.
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Plan Selection */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between font-mono text-xs px-2">
                      <span className="text-[var(--color-accent-primary)] font-bold">Infrastructure Tier</span>
                      <span className="text-[var(--color-text-dimmed)]">SELECT ONE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: "ENTERPRISE", name: "Enterprise", glow: "emerald", desc: "Full RLS isolation, unlimited cycles, custom RBAC." },
                        { id: "SCALE", name: "Scale", glow: "indigo", desc: "Advanced telemetry, priority queues, 99.9% SLA." },
                        { id: "GROWTH", name: "Growth", glow: "amber", desc: "Core goal alignment, standard audit logging." },
                      ].map((tier) => (
                        <div
                          key={tier.id}
                          onClick={() => setPlan(tier.id)}
                          className={`cursor-pointer p-6 border transition-all duration-300 flex flex-col justify-between ${
                            plan === tier.id
                              ? "bg-[var(--color-surface)] border-[var(--color-accent-primary)] shadow-[var(--shadow-ethereal-primary)]"
                              : "bg-[var(--color-surface)]/50 border-[var(--color-border-strong)] hover:border-white/20 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <div>
                            <div className="font-mono text-[10px] text-[var(--color-accent-primary)] mb-2">
                              {plan === tier.id ? "[ACTIVE_SELECTION]" : "TIER_STANDBY"}
                            </div>
                            <div className="text-xl font-serif text-[var(--color-text-main)] mb-2">{tier.name}</div>
                            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed font-sans">{tier.desc}</p>
                          </div>
                          <div className="mt-8 pt-4 border-t border-[var(--color-border)] font-mono text-[11px] text-[var(--color-text-dimmed)] flex justify-between items-center">
                            <span>SHARD_REP</span>
                            <span className={plan === tier.id ? "text-[var(--color-accent-primary)] font-bold" : ""}>
                              {plan === tier.id ? "ALLOCATED" : "AVAILABLE"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Pacing Strategy */}
                  <div className="space-y-6 p-8 bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-[var(--shadow-subtle)]">
                    <div className="border-b border-[var(--color-border)] pb-4 flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--color-accent-primary)] font-bold">Cadence Choreography</span>
                      <span className="text-[var(--color-text-dimmed)]">PACING_MODEL</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                      {[
                        { id: "A24_CINEMATIC", label: "A24 Cinematic Pacing", sub: "Emotional milestone momentum" },
                        { id: "STRICT_OKR", label: "Strict Fibonacci OKR", sub: "Rigorous quarterly weightage" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setCadence(item.id)}
                          className={`p-4 border cursor-pointer transition-colors ${
                            cadence === item.id
                              ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 text-[var(--color-text-main)] font-bold"
                              : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-white/20"
                          }`}
                        >
                          <div>{item.label}</div>
                          <div className="text-[10px] text-[var(--color-text-dimmed)] mt-1 font-normal">{item.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-[var(--color-signal-crimson)]/20 border border-[var(--color-signal-crimson)] text-[var(--color-signal-crimson)] font-mono text-xs flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-signal-crimson)] animate-ping" />
                      {error}
                    </div>
                  )}

                  <div className="pt-4">
                    <InteractiveButton
                      type="submit"
                      variant="glow"
                      disabled={loading || !name}
                      className="w-full text-base py-5 font-bold tracking-widest uppercase font-mono disabled:opacity-50"
                    >
                      {loading ? "PROVISIONING TENANT SHARD..." : "INITIALIZE SECURE TENANCY →"}
                    </InteractiveButton>
                  </div>
                </form>
              </StaggerItem>
            </StaggerGroup>

            {/* Right Column: Live Cryptographic Telemetry & Shard Allocation */}
            <div className="lg:col-span-5 space-y-8 sticky top-32">
              <div className="glass-panel p-8 space-y-8 shadow-[var(--shadow-float)] border border-[var(--color-border-strong)]">
                <div className="border-b border-[var(--color-border)] pb-4 flex items-center justify-between font-mono text-xs">
                  <span className="text-[var(--color-text-main)] font-bold">Shard Inspection Panel</span>
                  <span className="text-[var(--color-accent-primary)] animate-pulse">{"LIVE_STREAM"}</span>
                </div>

                <div className="space-y-6 font-mono text-xs">
                  <div>
                    <div className="text-[var(--color-text-dimmed)] mb-1">PROVISIONED DESIGNATION</div>
                    <div className="text-lg font-bold text-[var(--color-text-main)] truncate">
                      {name || "AWAITING_IDENTITY..."}
                    </div>
                  </div>

                  <div className="hairline-rule my-4" />

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-[var(--color-text-dimmed)] mb-1">CRYPTOGRAPHIC HASH</div>
                      <div className="text-[var(--color-accent-primary)] font-bold truncate">{shaHash}</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-text-dimmed)] mb-1">INFRASTRUCTURE TIER</div>
                      <div className="text-[var(--color-text-main)] font-bold">{plan}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div>
                      <div className="text-[var(--color-text-dimmed)] mb-1">ISOLATION POLICY</div>
                      <div className="text-[var(--color-signal-emerald)] font-bold">STRICT_RLS: TRUE</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-text-dimmed)] mb-1">ALLOCATED SHARD</div>
                      <div className="text-[var(--color-text-main)] font-bold">{activeShard}</div>
                    </div>
                  </div>

                  <div className="hairline-rule my-4" />

                  <div>
                    <div className="text-[var(--color-text-dimmed)] mb-2">PACING CHOREOGRAPHY</div>
                    <div className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)] flex items-center justify-between">
                      <span>CADENCE_MODEL</span>
                      <span className="text-[var(--color-text-main)] font-bold">{cadence}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[var(--color-bg)]/50 border border-[var(--color-border)] flex items-center gap-4 mt-8">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-signal-emerald)] animate-ping" />
                  <div className="font-mono text-[11px] text-[var(--color-text-muted)] leading-tight">
                    Database pool pre-warmed. Ready to accept cryptographic RLS migration upon form submission.
                  </div>
                </div>
              </div>

              {/* Auxiliary Quick Help */}
              <div className="p-6 border border-[var(--color-border)] bg-[var(--color-surface)]/40 font-mono text-xs space-y-3">
                <div className="text-[var(--color-text-dimmed)] uppercase tracking-wider">Onboarding FAQ</div>
                <div className="text-[var(--color-text-muted)] text-[11px] leading-relaxed">
                  Need to join an existing organization instead? Enter your corporate email during the primary authentication gateway flow to automatically trigger SAML/SSO tenant resolution.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- SUCCESS STATE FINALE --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto w-full glass-panel p-12 space-y-10 text-center shadow-[var(--shadow-float)] border border-[var(--color-accent-primary)]/50 relative z-20"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-accent-primary)]/20 border border-[var(--color-accent-primary)] flex items-center justify-center text-[var(--color-accent-primary)] text-2xl shadow-[var(--shadow-ethereal-primary)] animate-bounce">
              ✓
            </div>

            <div className="space-y-4">
              <div className="cinematic-kicker justify-center">
                <span className="signal-dot signal-dot-emerald" />
                {"TENANCY ALLOCATION SUCCESSFUL"}
              </div>
              <h2 className="text-cinematic-h2 leading-tight">
                Welcome to <br />
                <span className="text-cinematic-italic text-[var(--color-accent-primary)]">{successData.name}</span>.
              </h2>
              <p className="text-editorial-body text-base mx-auto max-w-lg">
                Your isolated database shard has been successfully provisioned. Row-Level Security (RLS) policies are active and linked to your current authentication session.
              </p>
            </div>

            <div className="p-6 bg-[var(--color-bg)] border border-[var(--color-border-strong)] text-left font-mono text-xs space-y-3 mx-auto max-w-md shadow-[var(--shadow-subtle)]">
              <div className="flex justify-between border-b border-[var(--color-border)] pb-2 text-[var(--color-text-dimmed)]">
                <span>TENANCY_RECORD</span>
                <span>VERIFIED</span>
              </div>
              <div className="flex justify-between"><span className="text-[var(--color-text-dimmed)]">ORGANIZATION ID:</span><span className="text-[var(--color-accent-primary)] font-bold">{successData.id}</span></div>
              <div className="flex justify-between"><span className="text-[var(--color-text-dimmed)]">INFRASTRUCTURE PLAN:</span><span className="text-[var(--color-text-main)] font-bold">{successData.plan}</span></div>
              <div className="flex justify-between"><span className="text-[var(---color-text-dimmed)]">CRYPTOGRAPHIC RLS:</span><span className="text-[var(--color-signal-emerald)] font-bold">ACTIVE_ENFORCED</span></div>
            </div>

            <div className="pt-6">
              <InteractiveButton
                variant="glow"
                onClick={handleEnterWorkspace}
                className="text-base py-5 px-12 font-bold tracking-widest uppercase font-mono shadow-[var(--shadow-ethereal-primary)]"
              >
                Enter Operational Workspace →
              </InteractiveButton>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- CINEMATIC FOOTER --- */}
      <footer className="border-t border-[var(--color-border-strong)] bg-[var(--color-surface)] py-12 text-xs font-mono text-[var(--color-text-dimmed)] relative z-10">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[var(--color-accent-primary)]" />
            <span>{"Syncora Portal - High-Precision Tenant Initialization"}</span>
          </div>
          <div className="flex items-center gap-8 text-[11px]">
            <span>SECURE_SHARD: ISOLATED</span>
            <span>COMPLIANCE: SOC2_TYPE_II</span>
            <span>PACING: A24_CINEMATIC</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
