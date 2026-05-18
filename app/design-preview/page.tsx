import Link from "next/link";
import { Surface } from "@/components/ui/surface";

export default function DesignPreviewPage() {
  return (
    <main className="editorial-canvas py-24 flex-1 space-y-20">
      <Surface elevation="surface" className="p-12 space-y-6">
        <div className="cinematic-kicker">
          <span className="signal-dot signal-dot-cerulean" />
          Syncora Enterprise Design System
        </div>

        <h1 className="text-cinematic-h1">
          Foundational <span className="text-cinematic-italic">Tokens</span> & <br />
          Enterprise Scale.
        </h1>

        <p className="text-editorial-body max-w-3xl">
          A reference view of the Syncora enterprise language system. The interface favors structured hierarchy, operational clarity, and audit-ready presentation.
        </p>
      </Surface>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Surface elevation="elevated" className="p-10 space-y-6">
          <div className="cinematic-kicker">01 / COLOR FOUNDATION</div>
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-base) border border-(--hairline-strong)">
              <span>GRAPHITE BASE</span>
              <span className="text-(--color-alabaster-muted)">#060608</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--hairline-strong)">
              <span>GRAPHITE SURFACE</span>
              <span className="text-(--color-alabaster-muted)">#0E0E12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-elevated) border border-(--hairline-strong)">
              <span>GRAPHITE ELEVATED</span>
              <span className="text-(--color-alabaster-muted)">#16161B</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-alabaster-base) text-(--color-graphite-base) font-bold">
              <span>ALABASTER BASE</span>
              <span>#FFFFFF</span>
            </div>
          </div>
        </Surface>

        <Surface elevation="elevated" className="p-10 space-y-6">
          <div className="cinematic-kicker">02 / SIGNAL TONES</div>
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-crimson) text-(--color-signal-crimson)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-crimson" /> SIGNAL CRIMSON</span>
              <span>#F43F5E</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-cerulean) text-(--color-signal-cerulean)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-cerulean" /> SIGNAL CERULEAN</span>
              <span>#0EA5E9</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-ochre) text-(--color-signal-ochre)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-ochre" /> SIGNAL OCHRE</span>
              <span>#F59E0B</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-emerald) text-(--color-signal-emerald)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-emerald" /> SIGNAL EMERALD</span>
              <span>#10B981</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-indigo) text-(--color-signal-indigo)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-indigo" /> SIGNAL INDIGO</span>
              <span>#6366F1</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-(--color-graphite-surface) border border-(--color-signal-purple) text-(--color-signal-purple)">
              <span className="flex items-center gap-2"><span className="signal-dot signal-dot-purple" /> SIGNAL PURPLE</span>
              <span>#8B5CF6</span>
            </div>
          </div>
        </Surface>
      </div>

      <Surface elevation="surface" className="p-12 space-y-10">
        <div className="cinematic-kicker">03 / TYPOGRAPHY HIERARCHY</div>
        <div className="space-y-8">
          <div>
            <div className="font-mono text-(--color-alabaster-dimmed) text-xs mb-2">CINEMATIC DISPLAY [INSTRUMENT SERIF]</div>
            <div className="text-cinematic-display">
              Strategic Intent & <span className="text-cinematic-italic">Operational Velocity</span>.
            </div>
          </div>
          <div className="hairline-rule my-6" />
          <div>
            <div className="font-mono text-(--color-alabaster-dimmed) text-xs mb-2">NARRATIVE SANS [INTER / BODY]</div>
            <div className="text-editorial-body max-w-3xl">
              Syncora choreographs strategic goals, AI check-ins, governance approval, and executive reporting into a single atmospheric operational system. Built for teams that need precision without bureaucracy.
            </div>
          </div>
          <div className="hairline-rule my-6" />
          <div>
            <div className="font-mono text-(--color-alabaster-dimmed) text-xs mb-2">TELEMETRY MONO [GEIST MONO / DATA]</div>
            <div className="font-mono text-sm text-(--color-alabaster-dimmed) tracking-wider uppercase">
              SYS_ID: SYNC-2026-REV-0 // CADENCE: AUDIT_GRADE // DELTA: +18.4%
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-(--hairline-base)">
          <Link href="/" className="font-mono text-(--color-alabaster-muted) hover:text-(--color-alabaster-stark) text-xs tracking-wider">
            ← RETURN TO LANDING PAGE
          </Link>
        </div>
      </Surface>
    </main>
  );
}
