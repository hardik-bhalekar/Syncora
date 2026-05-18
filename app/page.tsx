import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import { getDashboardHomePath } from "@/lib/rbac";
import { EditorialContainer } from "@/components/layout/editorial-container";
import { BentoGrid, BentoCard } from "@/components/layout/bento-grid";
import { InteractiveButton } from "@/components/ui/interactive-button";
import { InteractiveCard } from "@/components/ui/interactive-card";
import { TelemetryGrid } from "@/components/ui/telemetry-grid";
import { GoalGalaxy } from "@/components/three/goal-galaxy-client";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger-group";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CursorTracker } from "@/components/ui/cursor-tracker";

export default async function HomePage() {
  const session = await getServerAuthSession();
  const dashboardPath = session?.user?.role ? getDashboardHomePath(session.user.role) : "/login";

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text-main)] overflow-x-hidden selection:bg-[var(--color-accent-primary)] selection:text-white">
      <CursorTracker />

      <header className="absolute top-0 inset-x-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/60 backdrop-blur-2xl">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-[var(--color-accent-primary)] shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-sm font-bold tracking-widest uppercase">SYNCORA</span>
            <span className="text-xs font-mono text-[var(--color-text-dimmed)] hidden md:inline border-l border-[var(--color-border)] pl-4 ml-2">
              {"Enterprise Goal Cadence"}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-[var(--color-text-muted)]">
            <a href="#scene-02" className="hover:text-[var(--color-text-main)] transition-colors tracking-wide">Overview</a>
            <a href="#scene-03" className="hover:text-[var(--color-text-main)] transition-colors tracking-wide">Workflow</a>
            <a href="#scene-04" className="hover:text-[var(--color-text-main)] transition-colors tracking-wide">Governance</a>
            <a href="#scene-06" className="hover:text-[var(--color-text-main)] transition-colors tracking-wide">Reporting</a>
            <Link href="/design-preview" className="hover:text-[var(--color-text-main)] transition-colors tracking-wide">Design System</Link>
          </nav>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            {session?.user ? (
              <Link href={dashboardPath}>
                <InteractiveButton variant="glow">Launch Workspace</InteractiveButton>
              </Link>
            ) : (
              <Link href="/login">
                <InteractiveButton variant="glass">Launch Workspace</InteractiveButton>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section id="scene-01" className="cinematic-scene min-h-screen pt-24 border-b border-[var(--color-border)]">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
          <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-40">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-40822-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="ambient-glow-primary -top-20 -left-20" />
        <div className="ambient-glow-primary top-1/4 -right-20" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-200px)] py-12">
            <StaggerGroup className="lg:col-span-7 flex flex-col justify-center z-10">
              <StaggerItem>
                <div className="cinematic-kicker">
                  <span className="signal-dot signal-dot-primary" />
                  {"Enterprise Alignment"}
                </div>
              </StaggerItem>

              <StaggerItem>
                <h1 className="text-cinematic-display mt-4">
                  Align Organizational Goals <br />
                  <span className="text-cinematic-italic">With Real-Time Performance Visibility</span>
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="text-editorial-body mt-8 max-w-xl">
                  Syncora centralizes goal planning, quarterly reviews, approvals, and performance governance into a structured enterprise workflow platform designed for modern organizations.
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap items-center gap-6 mt-12">
                  {session?.user ? (
                    <Link href={dashboardPath}>
                      <InteractiveButton variant="glow" className="text-base px-8 py-4">
                        Launch Workspace
                      </InteractiveButton>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <InteractiveButton variant="glow" className="text-base px-8 py-4">
                        Launch Workspace
                      </InteractiveButton>
                    </Link>
                  )}
                  <Link href="/design-preview">
                    <InteractiveButton variant="glass" className="text-base px-8 py-4">
                      Explore Platform
                    </InteractiveButton>
                  </Link>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-center gap-12 mt-20 pt-10 border-t border-[var(--color-border)]">
                  <div>
                    <div className="telemetry-label">CHOREOGRAPHY</div>
                    <div className="font-mono text-base font-bold text-[var(--color-accent-primary)] mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
                      {"92% Goal Submission Completion"}
                    </div>
                  </div>
                  <div className="hairline-rule-vertical h-10" />
                  <div>
                    <div className="telemetry-label">ZERO-TRUST RBAC</div>
                    <div className="font-mono text-base font-bold text-[var(--color-text-main)] mt-1">
                      {"4 ACTIVE REVIEW CYCLES"}
                    </div>
                  </div>
                  <div className="hairline-rule-vertical h-10 hidden sm:block" />
                  <div className="hidden sm:block">
                    <div className="telemetry-label">REAL-TIME CDC</div>
                    <div className="font-mono text-base font-bold text-[var(--color-accent-primary)] mt-1">
                      {"1,248 CHECK-INS LOGGED"}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </StaggerGroup>

            <div className="lg:col-span-5 h-[450px] lg:h-[650px] relative w-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] overflow-hidden shadow-[var(--shadow-float)] group">
              <GoalGalaxy />
              <div className="absolute bottom-6 left-6 z-20 glass-panel px-4 py-2 font-mono text-xs text-[var(--color-text-dimmed)]">
                {"Enterprise Workflow Live"}
              </div>
              <div className="absolute top-6 right-6 z-20 glass-panel px-3 py-1 font-mono text-[10px] text-[var(--color-accent-primary)] border-[var(--color-accent-primary)]/30">
                {"Governance Active"}
              </div>
            </div>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-02" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="ambient-glow-primary top-1/3 left-1/4" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20">
            <div className="lg:col-span-5 marginalia-column space-y-6 order-2 lg:order-1">
              <div className="cinematic-kicker">
                <span className="signal-dot signal-dot-primary" />
                {"Structured Execution"}
              </div>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed font-sans">
                Syncora enables employees, managers, and HR teams to manage the complete performance lifecycle through governed workflows, role-based approvals, and real-time operational visibility.
              </p>
              <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--color-text-dimmed)]">PACING_CURVE:</span>
                <span className="text-[var(--color-accent-primary)] font-bold">GOVERNED_EXECUTION</span>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <h2 className="text-cinematic-h1 leading-tight">
                We believe enterprise software should feel like an <span className="text-cinematic-italic text-[var(--color-accent-primary)]">operational system</span>, not a generic form.
              </h2>
              <div className="flex items-center gap-6 pt-4">
                <div className="h-px flex-1 bg-[var(--color-border-strong)]" />
                <span className="font-mono text-xs text-[var(--color-text-dimmed)] tracking-widest uppercase">OPERATIONAL CLARITY</span>
              </div>
            </div>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-03" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
          <TelemetryGrid />
        </div>

        <div className="ambient-glow-primary top-1/4 right-10" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-20">
          <div className="max-w-3xl space-y-6">
            <div className="cinematic-kicker">
              <span className="signal-dot signal-dot-primary" />
              {"Operational Execution"}
            </div>
            <h2 className="text-cinematic-h1">
              Built for <span className="text-cinematic-italic">Structured Organizational Execution</span>.
            </h2>
            <p className="text-editorial-body">
              Syncora centralizes goal planning, approvals, quarterly reviews, and accountability workflows with executive-grade visibility.
            </p>
          </div>

          <BentoGrid columns={3}>
            <BentoCard colSpan={2} rowSpan={1} glowColor="emerald">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="signal-dot signal-dot-primary" />
                  {"Goal Lifecycle Management"}
                </div>
                <h3 className="text-cinematic-h3">Goal Lifecycle Management</h3>
                <p className="text-editorial-body mt-4 text-base">
                  Create, review, approve, and govern organizational goals across quarterly performance cycles.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-[var(--color-border-strong)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-text-dimmed)]">STATUS: ACTIVE_STREAM</span>
                <span className="font-mono text-xs text-[var(--color-accent-primary)] font-bold">100% GOVERNED</span>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} glowColor="indigo">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="signal-dot signal-dot-primary" />
                  {"Manager Review Workflows"}
                </div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Manager Review Workflows</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Enable structured approvals, inline target adjustments, and documented quarterly check-ins.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-[var(--color-border-strong)]">
                <span className="font-mono text-xs text-[var(--color-accent-primary)]">{"SERVER-SIDE VALIDATED"}</span>
              </div>
            </BentoCard>

            <BentoCard colSpan={1} rowSpan={1} glowColor="amber">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="signal-dot signal-dot-primary" />
                  {"Audit & Governance"}
                </div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-3">Audit & Governance Controls</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Track approval history, target modifications, escalations, and policy exceptions across departments.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-[var(--color-border-strong)]">
                <span className="font-mono text-xs text-[var(--color-accent-primary)]">IMMUTABLE AUDIT LOGS</span>
              </div>
            </BentoCard>

            <BentoCard colSpan={2} rowSpan={1} glowColor="cerulean">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
                  <span className="signal-dot signal-dot-primary" />
                  {"Performance Analytics"}
                </div>
                <h3 className="text-cinematic-h3">Performance Analytics</h3>
                <p className="text-editorial-body mt-4 text-base">
                  Monitor organizational completion rates, progress distribution, and department-level execution trends.
                </p>
              </div>
              <div className="mt-12 pt-8 border-t border-[var(--color-border-strong)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-text-dimmed)]">REAL-TIME CDC SYNC</span>
                <Link href="/dashboard/analytics" className="text-xs font-mono text-[var(--color-accent-primary)] hover:underline flex items-center gap-1">
                  INSPECT PERFORMANCE →
                </Link>
              </div>
            </BentoCard>
          </BentoGrid>
        </EditorialContainer>
      </section>

      <section id="scene-04" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
          <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-30">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-futuristic-geomteric-background-animation-37604-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="ambient-glow-primary top-1/3 right-1/3" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--color-border-strong)] pb-12">
            <div className="space-y-4 max-w-2xl">
              <div className="cinematic-kicker">
                <span className="signal-dot signal-dot-primary" />
                {"Performance Governance"}
              </div>
              <h2 className="text-cinematic-h1">
                Audit-Ready <span className="text-cinematic-italic text-[var(--color-accent-primary)]">Performance Governance</span>.
              </h2>
              <p className="text-editorial-body text-base">
                Every approval, target edit, and review action is captured with traceable history for executive oversight.
              </p>
            </div>
            <div className="glass-panel p-6 font-mono text-xs space-y-2 max-w-xs">
              <div className="text-[var(--color-accent-primary)] font-bold">{"GOVERNANCE_STATUS: ACTIVE"}</div>
              <div className="text-[var(--color-text-dimmed)]">APPROVAL_EVENTS: 14,892</div>
              <div className="text-[var(--color-accent-primary)]">COMPLIANCE_SCORE: 100%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InteractiveCard glowColor="purple">
              <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-4">MODULE_01</div>
              <h4 className="text-xl font-serif text-[var(--color-text-main)] mb-2">Cycle Configuration</h4>
              <p className="text-sm text-[var(--color-text-muted)]">Create quarterly review windows and govern active cycle timing across the organization.</p>
            </InteractiveCard>

            <InteractiveCard glowColor="indigo">
              <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-4">MODULE_02</div>
              <h4 className="text-xl font-serif text-[var(--color-text-main)] mb-2">Organizational Hierarchy</h4>
              <p className="text-sm text-[var(--color-text-muted)]">Model employees, managers, and HR boundaries for controlled approval routing.</p>
            </InteractiveCard>

            <InteractiveCard glowColor="emerald">
              <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-4">MODULE_03</div>
              <h4 className="text-xl font-serif text-[var(--color-text-main)] mb-2">Audit Monitoring</h4>
              <p className="text-sm text-[var(--color-text-muted)]">Record approval history, target changes, escalations, and review outcomes.</p>
            </InteractiveCard>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-05" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="ambient-glow-primary bottom-10 left-10" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-16">
          <div className="max-w-3xl space-y-6">
            <div className="cinematic-kicker">
              <span className="signal-dot signal-dot-primary" />
              {"Role-Based Workspaces"}
            </div>
            <h2 className="text-cinematic-h1">
              Governance-Aware <span className="text-cinematic-italic">Role Workspaces</span>.
            </h2>
            <p className="text-editorial-body">
              Explore the dedicated employee, manager, and admin workspaces that make accountability visible at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InteractiveCard glowColor="amber" className="flex flex-col justify-between h-80">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-2">TIER_01 GOVERNANCE</div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">Control Center</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Manage review cycles, organizational governance, escalations, and enterprise-wide visibility.</p>
              </div>
              <div className="pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-accent-primary)]">[STRICT_MODE]</span>
                <Link href="/dashboard/admin" className="font-mono text-xs text-[var(--color-text-main)] hover:underline">EXPLORE CONTROL CENTER →</Link>
              </div>
            </InteractiveCard>

            <InteractiveCard glowColor="cerulean" className="flex flex-col justify-between h-80">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-2">TIER_02 ALIGNMENT</div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">Manager Workspace</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Review employee submissions, manage quarterly check-ins, and monitor department execution metrics.</p>
              </div>
              <div className="pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-accent-primary)]">[ACTION_REQD]</span>
                <Link href="/dashboard/manager" className="font-mono text-xs text-[var(--color-text-main)] hover:underline">EXPLORE MANAGER →</Link>
              </div>
            </InteractiveCard>

            <InteractiveCard glowColor="emerald" className="flex flex-col justify-between h-80">
              <div>
                <div className="font-mono text-xs text-[var(--color-accent-primary)] mb-2">TIER_03 CONTINUUM</div>
                <h3 className="text-2xl font-serif text-[var(--color-text-main)] mb-4">Performance Workspace</h3>
                <p className="text-sm text-[var(--color-text-muted)]">Track assigned goals, quarterly progress, and review activity from a centralized operational dashboard.</p>
              </div>
              <div className="pt-6 border-t border-[var(--color-border-strong)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-accent-primary)]">[ON_TRACK]</span>
                <Link href="/dashboard/employee" className="font-mono text-xs text-[var(--color-text-main)] hover:underline">EXPLORE PERFORMANCE WORKSPACE →</Link>
              </div>
            </InteractiveCard>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-06" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="ambient-glow-primary top-1/3 left-1/3" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-16">
          <div className="max-w-3xl space-y-6">
            <div className="cinematic-kicker">
              <span className="signal-dot signal-dot-primary" />
              {"Asynchronous Orchestration"}
            </div>
            <h2 className="text-cinematic-h1">
              Automated SLA <span className="text-cinematic-italic text-[var(--color-accent-primary)]">Escalation Engine</span>.
            </h2>
            <p className="text-editorial-body">
              Engineered for enterprise-grade resilience. Our Inngest background workers monitor check-in progress thresholds (&lt;70%) and submission deadlines, triggering multi-level escalations (Manager, HR, Executive) with Circuit Breaker protected webhooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono">
            <div className="glass-panel p-8 space-y-4">
              <div className="text-xs text-[var(--color-text-dimmed)]">SLA_COMPLIANCE</div>
              <div className="text-4xl font-bold text-[var(--color-accent-primary)]">99.8%</div>
              <div className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-strong)] pt-4">AUTOMATED ESCALATION MONITORING</div>
            </div>

            <div className="glass-panel p-8 space-y-4">
              <div className="text-xs text-[var(--color-text-dimmed)]">CIRCUIT_BREAKER</div>
              <div className="text-4xl font-bold text-[var(--color-accent-primary)]">ACTIVE</div>
              <div className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-strong)] pt-4">TEAMS ADAPTIVE CARDS v1.4</div>
            </div>

            <div className="glass-panel p-8 space-y-4">
              <div className="text-xs text-[var(--color-text-dimmed)]">REALTIME_CDC</div>
              <div className="text-4xl font-bold text-[var(--color-accent-primary)]">&lt;15MS</div>
              <div className="text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-strong)] pt-4">SUPABASE WEBSOCKET RECONCILIATION</div>
            </div>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-07" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="absolute inset-0 z-0 overflow-hidden opacity-15">
          <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-30">
            <source src="https://assets.mixkit.co/videos/preview/mixkit-technological-background-with-code-lines-31766-large.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="ambient-glow-primary bottom-10 right-10" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="cinematic-kicker">
                <span className="signal-dot signal-dot-primary" />
                {"Architectural Restraint"}
              </div>
              <h2 className="text-cinematic-h1 leading-tight">
                Engineered for <span className="text-cinematic-italic text-[var(--color-accent-primary)]">Extreme Restraint</span>.
              </h2>
              <p className="text-editorial-body">
                We have completely purged all boilerplate SaaS templates, random floating blobs, and generic AI glows. What remains is a handcrafted, art-directed instrument built for elite organizations that demand absolute telemetry.
              </p>
              <div className="pt-8 border-t border-[var(--color-border-strong)] flex items-center gap-8 font-mono text-xs">
                <div>
                  <span className="text-[var(--color-text-dimmed)]">COMPOSITION:</span>
                  <span className="text-[var(--color-text-main)] ml-2">ASYMMETRIC</span>
                </div>
                <div className="hairline-rule-vertical h-6" />
                <div>
                  <span className="text-[var(--color-text-dimmed)]">FEEL:</span>
                  <span className="text-[var(--color-accent-primary)] ml-2">HANDCRAFTED</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 glass-panel p-10 space-y-6 shadow-[var(--shadow-float)]">
              <div className="font-mono text-xs text-[var(--color-accent-primary)] flex items-center justify-between border-b border-white/10 pb-4">
                <span>{"SYSTEM_SPECIMEN"}</span>
                <span>{"v2026.5"}</span>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <div className="flex justify-between p-3 bg-white/5 border border-white/10">
                  <span className="text-[var(--color-text-dimmed)]">UI_STYLING</span>
                  <span className="text-white font-bold">CINEMATIC_GRAPHITE</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 border border-white/10">
                  <span className="text-[var(--color-text-dimmed)]">MOTION_BEHAVIOR</span>
                  <span className="text-white font-bold">CALM_SPRING_PHYSICS</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 border border-white/10">
                  <span className="text-[var(--color-text-dimmed)]">TYPOGRAPHY_SCALE</span>
                  <span className="text-white font-bold">INSTRUMENT_SERIF</span>
                </div>
              </div>
              <Link href="/design-preview" className="block text-center pt-4 font-mono text-xs text-[var(--color-accent-primary)] hover:underline">
                INSPECT FULL TOKEN SPECIMEN →
              </Link>
            </div>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-08" className="cinematic-scene border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="ambient-glow-primary top-10 left-1/3" />
        <div className="depth-fog-top" />
        <div className="depth-fog-bottom" />

        <EditorialContainer variant="marketing" className="relative z-10 space-y-16">
          <div className="max-w-3xl space-y-6">
            <div className="cinematic-kicker">
              <span className="signal-dot signal-dot-primary" />
              {"Telemetry at 60FPS"}
            </div>
            <h2 className="text-cinematic-h1">
              Uncompromising <span className="text-cinematic-italic">Performance</span> Containment.
            </h2>
            <p className="text-editorial-body">
              Heavy assets are lazy-loaded, WebGL buffers are strictly guarded, and layout thrashing is eliminated to maintain a fluid, enterprise-grade 60FPS experience across all devices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 font-mono">
            <div className="border border-[var(--color-border-strong)] p-8 bg-[var(--color-bg)] space-y-2 shadow-[var(--shadow-subtle)]">
              <div className="text-3xl font-bold text-[var(--color-text-main)]">60 FPS</div>
              <div className="text-xs text-[var(--color-text-dimmed)]">STABLE FRAME RATE</div>
            </div>
            <div className="border border-[var(--color-border-strong)] p-8 bg-[var(--color-bg)] space-y-2 shadow-[var(--shadow-subtle)]">
              <div className="text-3xl font-bold text-[var(--color-accent-primary)]">&lt; 100ms</div>
              <div className="text-xs text-[var(--color-text-dimmed)]">LARGEST CONTENTFUL PAINT</div>
            </div>
            <div className="border border-[var(--color-border-strong)] p-8 bg-[var(--color-bg)] space-y-2 shadow-[var(--shadow-subtle)]">
              <div className="text-3xl font-bold text-[var(--color-accent-primary)]">ZERO</div>
              <div className="text-xs text-[var(--color-text-dimmed)]">CUMULATIVE LAYOUT SHIFT</div>
            </div>
            <div className="border border-[var(--color-border-strong)] p-8 bg-[var(--color-bg)] space-y-2 shadow-[var(--shadow-subtle)]">
              <div className="text-3xl font-bold text-[var(--color-accent-primary)]">100%</div>
              <div className="text-xs text-[var(--color-text-dimmed)]">GPU ACCELERATED</div>
            </div>
          </div>
        </EditorialContainer>
      </section>

      <section id="scene-09" className="cinematic-scene bg-[var(--color-bg)] py-32">
        <div className="ambient-glow-primary top-1/4 left-1/4" />
        <div className="ambient-glow-primary bottom-10 right-1/4" />
        <div className="depth-fog-top" />

        <EditorialContainer variant="constrained" className="relative z-10 text-center space-y-12">
          <div className="cinematic-kicker justify-center">
            <span className="signal-dot signal-dot-primary" />
            {"The Finale"}
          </div>
          <h2 className="text-cinematic-display leading-tight">
            Initiate Your <br />
            <span className="text-cinematic-italic">Cinematic Cadence</span>.
          </h2>
          <p className="text-editorial-body mx-auto max-w-2xl text-xl">
            Join the elite engineering teams utilizing Syncora for transparent, high-performance goal synchronization.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
            {session?.user ? (
              <Link href={dashboardPath}>
                <InteractiveButton variant="glow" className="text-lg px-10 py-5">
                  Enter Operational Workspace
                </InteractiveButton>
              </Link>
            ) : (
              <Link href="/login">
                <InteractiveButton variant="glow" className="text-lg px-10 py-5">
                  Access System Gateway
                </InteractiveButton>
              </Link>
            )}
            <Link href="/design-preview">
              <InteractiveButton variant="glass" className="text-lg px-10 py-5">
                View Design Specimen
              </InteractiveButton>
            </Link>
          </div>
        </EditorialContainer>
      </section>

      <footer className="border-t border-[var(--color-border-strong)] bg-[var(--color-surface)] py-16 text-xs font-mono text-[var(--color-text-dimmed)] relative z-10">
        <div className="max-w-[1440px] mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[var(--color-accent-primary)]" />
            <span>{"Syncora Portal - Enterprise Frontend Rebuild"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-[11px]">
            <span>SECURE_SESSION: ACTIVE</span>
            <span>ISOLATION: STRICT RLS</span>
            <span>PACING: EDITORIAL RHYTHM</span>
            <span>UI/UX: WORLD_CLASS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
