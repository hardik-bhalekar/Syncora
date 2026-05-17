import Link from "next/link"

export default function DesignPreviewPage() {
  return (
    <main className="editorial-canvas py-16 flex-1 space-y-16">
      <div className="wireframe-box">
        <div className="cinematic-kicker">
          <span className="signal-dot signal-dot-cerulean" />
          Syncora Design Language Specimen
        </div>

        <h1 className="editorial-headline mt-4 text-4xl">
          Foundational <span className="editorial-headline-italic">Tokens</span> & <br />
          Architectural Scale.
        </h1>

        <p className="prose-restrained mt-4 text-sm">
          A definitive specimen of the new Syncora design language. All generic SaaS cards, glassmorphism, AI glitter, and crypto gradients have been abandoned in favor of strict editorial hierarchy and cinematic graphite depth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="wireframe-box space-y-6">
          <div className="cinematic-kicker">01 / COLOR FOUNDATION</div>
          <div className="space-y-4 telemetry-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-base)] border border-[var(--hairline-strong)]">
              <span>GRAPHITE BASE</span>
              <span className="text-[var(--color-alabaster-muted)]">#0A0A0C</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-surface)] border border-[var(--hairline-strong)]">
              <span>GRAPHITE SURFACE</span>
              <span className="text-[var(--color-alabaster-muted)]">#121215</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-elevated)] border border-[var(--hairline-strong)]">
              <span>GRAPHITE ELEVATED</span>
              <span className="text-[var(--color-alabaster-muted)]">#1A1A1E</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-alabaster-base)] text-[var(--color-graphite-base)] font-bold">
              <span>ALABASTER BASE</span>
              <span>#F4F4F6</span>
            </div>
          </div>
        </div>

        <div className="wireframe-box space-y-6">
          <div className="cinematic-kicker">02 / SIGNAL TONES</div>
          <div className="space-y-4 telemetry-mono text-xs">
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-elevated)] border border-[var(--color-signal-crimson)] text-[var(--color-signal-crimson)]">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-crimson" /> SIGNAL CRIMSON</span>
              <span>#D9383A</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-elevated)] border border-[var(--color-signal-cerulean)] text-[var(--color-signal-cerulean)]">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-cerulean" /> SIGNAL CERULEAN</span>
              <span>#2B5B84</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-elevated)] border border-[var(--color-signal-ochre)] text-[var(--color-signal-ochre)]">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-ochre" /> SIGNAL OCHRE</span>
              <span>#C8963E</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--color-graphite-elevated)] border border-[var(--color-signal-emerald)] text-[var(--color-signal-emerald)]">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-emerald" /> SIGNAL EMERALD</span>
              <span>#2D7D46</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wireframe-box space-y-8">
        <div className="cinematic-kicker">03 / TYPOGRAPHY HIERARCHY</div>
        <div className="space-y-6">
          <div>
            <div className="telemetry-mono text-[var(--color-alabaster-dimmed)] text-xs mb-2">EDITORIAL SERIF [NEWSREADER / DISPLAY]</div>
            <div className="font-serif text-3xl md:text-5xl text-[var(--color-alabaster-stark)] leading-tight">
              Strategic Intent & <span className="italic text-[var(--color-parchment-base)]">Operational Velocity</span>.
            </div>
          </div>
          <div className="hairline-rule my-4" />
          <div>
            <div className="telemetry-mono text-[var(--color-alabaster-dimmed)] text-xs mb-2">NARRATIVE SANS [SPACE GROTESK / BODY]</div>
            <div className="font-sans text-base text-[var(--color-alabaster-muted)] leading-relaxed max-w-2xl">
              Syncora choreographs strategic goals, AI check-ins, governance approval, and executive reporting into a single atmospheric operational system. Built for teams that need precision without bureaucracy.
            </div>
          </div>
          <div className="hairline-rule my-4" />
          <div>
            <div className="telemetry-mono text-[var(--color-alabaster-dimmed)] text-xs mb-2">TELEMETRY MONO [ROBOTO MONO / DATA]</div>
            <div className="font-mono text-sm text-[var(--color-alabaster-dimmed)] tracking-wider uppercase">
              SYS_ID: SYNC-2026-REV-0 // CADENCE: AUDIT_GRADE // DELTA: +18.4%
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--hairline-base)]">
          <Link href="/" className="telemetry-mono text-[var(--color-alabaster-muted)] hover:text-[var(--color-alabaster-stark)] text-xs">
            ← RETURN TO LANDING WIREFRAME
          </Link>
        </div>
      </div>
    </main>
  )
}
