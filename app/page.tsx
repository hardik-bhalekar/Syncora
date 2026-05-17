/**
 * SYNCORA MARKETING LANDING PAGE
 * ----------------------------
 * Handcrafted editorial composition featuring dramatic typography rhythm,
 * restrained Spline 3D spatial integration, asymmetrical bento grids,
 * and magnetic tactile microinteractions.
 */

import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import { getDashboardHomePath } from "@/lib/rbac";
import { EditorialContainer } from "@/components/layout/editorial-container";
import { BentoGrid, BentoCard } from "@/components/layout/bento-grid";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { SplineLoader } from "@/components/spline/spline-loader";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CursorTracker } from "@/components/ui/cursor-tracker";

export default async function HomePage() {
  const session = await getServerAuthSession();
  const dashboardPath = session?.user?.role ? getDashboardHomePath(session.user.role) : "/login";

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-hidden selection:bg-[var(--color-signal-emerald)] selection:text-white">
      {/* Hardware-Accelerated Custom Cursor Tracker */}
      <CursorTracker />

      {/* --- ACT I: EDITORIAL NAVIGATION HEADER --- */}
      <header className="absolute top-0 inset-x-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[var(--color-signal-emerald)] rounded-none" />
            <span className="font-mono text-sm font-bold tracking-widest uppercase">SYNCORA</span>
            <span className="text-xs font-mono text-[var(--color-text-dimmed)] hidden md:inline">
              {"// TELEMETRY & GOAL CADENCE"}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-muted)]">
            <a href="#features" className="hover:text-[var(--color-text-main)] transition-colors">Architecture</a>
            <a href="#telemetry" className="hover:text-[var(--color-text-main)] transition-colors">Telemetry Engine</a>
            <Link href="/design-preview" className="hover:text-[var(--color-text-main)] transition-colors">Design Specimen</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session?.user ? (
              <Link href={dashboardPath}>
                <InteractiveButton variant="primary">Enter Workspace →</InteractiveButton>
              </Link>
            ) : (
              <Link href="/login">
                <InteractiveButton variant="secondary">Access Gateway →</InteractiveButton>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- ACT II: OVERSIZED HERO STATEMENT & SPLINE 3D --- */}
      <main className="flex-1 pt-20">
        <EditorialContainer variant="marketing">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-160px)] py-12">
            {/* Left Column: Dramatic Editorial Typography */}
            <StaggerGroup className="lg:col-span-7 flex flex-col justify-center z-10">
              <StaggerItem>
                <div className="cinematic-kicker">
                  <span className="signal-dot signal-dot-emerald" />
                  {"PROD_BUILD // v2026.5"}
                </div>
              </StaggerItem>

              <StaggerItem>
                <h1 className="text-display-2xl mt-4">
                  Enterprise Goal Intelligence <br />
                  <span className="editorial-serif-italic">Reimagined</span>.
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="prose-restrained mt-6 text-lg">
                  A complete departure from templated SaaS dashboards and superficial AI glitter. Syncora delivers high-precision goal alignment, cryptographic RBAC verification, and real-time operational cadence designed for elite engineering organizations.
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap items-center gap-6 mt-10">
                  {session?.user ? (
                    <Link href={dashboardPath}>
                      <InteractiveButton variant="primary" className="text-base px-6 py-3">
                        Launch Workspace
                      </InteractiveButton>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <InteractiveButton variant="primary" className="text-base px-6 py-3">
                        Authenticate System
                      </InteractiveButton>
                    </Link>
                  )}
                  <Link href="/design-preview">
                    <InteractiveButton variant="ghost" className="text-base px-6 py-3">
                      Inspect Design Tokens
                    </InteractiveButton>
                  </Link>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-center gap-8 mt-16 pt-8 border-t border-[var(--color-border)]">
                  <div>
                    <div className="telemetry-label">SYSTEM STATE</div>
                    <div className="font-mono text-base font-bold text-[var(--color-signal-emerald)] mt-1">
                      {"OPTIMIZED // 60FPS"}
                    </div>
                  </div>
                  <div className="hairline-rule-vertical h-8" />
                  <div>
                    <div className="telemetry-label">CRYPTOGRAPHIC RBAC</div>
                    <div className="font-mono text-base font-bold text-[var(--color-text-main)] mt-1">
                      ENFORCED
                    </div>
                  </div>
                  <div className="hairline-rule-vertical h-8 hidden sm:block" />
                  <div className="hidden sm:block">
                    <div className="telemetry-label">AUTONOMOUS VERIFY</div>
                    <div className="font-mono text-base font-bold text-[var(--color-text-main)] mt-1">
                      RALPH_LOOP
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </StaggerGroup>

            {/* Right Column: Restrained Spline 3D Spatial Asset */}
            <div className="lg:col-span-5 h-[400px] lg:h-[600px] relative w-full border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-subtle)]">
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-10" />
              <SplineLoader
                scene="https://prod.spline.design/6Wq1Q7YGyMVMOB0f/scene.splinecode"
                fallbackImageUrl="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
              />
              <div className="absolute bottom-4 left-4 z-20 bg-[var(--color-bg)]/90 border border-[var(--color-border)] px-3 py-1 font-mono text-xs text-[var(--color-text-dimmed)] backdrop-blur-sm">
                {"SPATIAL INTERACTION // DRAG TO ORBIT"}
              </div>
            </div>
          </div>
        </EditorialContainer>

        {/* --- ACT III: ASYMMETRICAL BENTO GRID ARCHITECTURE --- */}
        <section id="features" className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
          <EditorialContainer variant="marketing">
            <div className="max-w-3xl mb-16">
              <div className="cinematic-kicker">
                <span className="signal-dot signal-dot-cerulean" />
                FOUNDATIONAL CAPABILITIES
              </div>
              <h2 className="text-display-xl mt-4">
                Engineered for <span className="editorial-serif-italic">Restraint</span> & Precision.
              </h2>
              <p className="prose-restrained mt-6">
                Every component is built with rigorous attention to typography rhythm, spring physics orchestration, and absolute performance containment.
              </p>
            </div>

            <BentoGrid columns={3}>
              {/* Card 1: Large Feature */}
              <BentoCard colSpan={2} rowSpan={1}>
                <div>
                  <div className="font-mono text-xs text-[var(--color-signal-emerald)] font-semibold tracking-widest uppercase mb-4">
                    {"// TELEMETRY ENGINE"}
                  </div>
                  <h3 className="text-heading-l">Real-Time Operational Cadence</h3>
                  <p className="prose-restrained mt-4">
                    Monitor enterprise goal alignment across administrative, managerial, and employee tiers with sub-millisecond state updates and zero layout shifts.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--color-text-dimmed)]">STATUS: ACTIVE_STREAM</span>
                  <span className="font-mono text-xs text-[var(--color-text-main)] font-bold">100% ALIGNED</span>
                </div>
              </BentoCard>

              {/* Card 2 */}
              <BentoCard colSpan={1} rowSpan={1}>
                <div>
                  <div className="font-mono text-xs text-[var(--color-signal-cerulean)] font-semibold tracking-widest uppercase mb-4">
                    {"// SECURITY TIER"}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)]">Cryptographic RBAC</h3>
                  <p className="prose-restrained mt-4 text-sm">
                    Impenetrable role-based access control isolating Admin, Manager, and Employee execution environments.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                  <span className="font-mono text-xs text-[var(--color-signal-emerald)]">{"SECURE // SHA-256"}</span>
                </div>
              </BentoCard>

              {/* Card 3 */}
              <BentoCard colSpan={1} rowSpan={1}>
                <div>
                  <div className="font-mono text-xs text-[var(--color-signal-ochre)] font-semibold tracking-widest uppercase mb-4">
                    {"// VERIFICATION"}
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-text-main)]">Ralph Loop Automation</h3>
                  <p className="prose-restrained mt-4 text-sm">
                    Autonomous AI verification ensuring 100% user story compliance before production deployment.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                  <span className="font-mono text-xs text-[var(--color-text-dimmed)]">VERIFY_PASS</span>
                </div>
              </BentoCard>

              {/* Card 4: Wide Card */}
              <BentoCard colSpan={2} rowSpan={1}>
                <div>
                  <div className="font-mono text-xs text-[var(--color-text-dimmed)] font-semibold tracking-widest uppercase mb-4">
                    {"// FINTECH MICROSERVICE"}
                  </div>
                  <h3 className="text-heading-l">Decoupled Live Interest Engine</h3>
                  <p className="prose-restrained mt-4">
                    Integrated high-precision DECIMAL financial calculation service with in-memory caching and resilient fallback guarantees.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--color-text-dimmed)]">LATENCY: &lt;12MS</span>
                  <Link href="/dashboard/analytics" className="text-xs font-mono text-[var(--color-signal-emerald)] hover:underline">
                    INSPECT TELEMETRY →
                  </Link>
                </div>
              </BentoCard>
            </BentoGrid>
          </EditorialContainer>
        </section>

        {/* --- ACT IV: CALL TO ACTION CLOSING --- */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-24">
          <EditorialContainer variant="constrained" className="text-center">
            <div className="cinematic-kicker justify-center mb-4">
              <span className="signal-dot signal-dot-emerald" />
              SYSTEM READY FOR DEPLOYMENT
            </div>
            <h2 className="text-display-xl mt-4">
              Initiate Your <span className="editorial-serif-italic">Operational Cadence</span>.
            </h2>
            <p className="prose-restrained mx-auto mt-6 text-lg">
              Join the elite engineering teams utilizing Syncora for transparent, high-performance goal synchronization.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              {session?.user ? (
                <Link href={dashboardPath}>
                  <InteractiveButton variant="primary" className="text-base px-8 py-4">
                    Enter Workspace
                  </InteractiveButton>
                </Link>
              ) : (
                <Link href="/login">
                  <InteractiveButton variant="primary" className="text-base px-8 py-4">
                    Access System Gateway
                  </InteractiveButton>
                </Link>
              )}
              <Link href="/design-preview">
                <InteractiveButton variant="secondary" className="text-base px-8 py-4">
                  View Design Specimen
                </InteractiveButton>
              </Link>
            </div>
          </EditorialContainer>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] py-12 text-xs font-mono text-[var(--color-text-dimmed)]">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>{"SYNCORA PORTAL // FOUNDATIONAL ARCHITECTURE"}</div>
          <div className="flex items-center gap-6">
            <span>SECURE_SESSION: ACTIVE</span>
            <span>ENCRYPTION: AES-256-GCM</span>
            <span>UI/UX: PRO_MAX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
