/**
 * SYNCORA SPLINE LOADER & RUNTIME GUARD
 * -------------------------------------
 * Production-ready Spline 3D wrapper implementing strict CLS prevention,
 * hardware concurrency checks, mobile fallbacks, next/dynamic SSR safety,
 * robust Error Boundary catching, timeout fallbacks, and user Force-Mount controls.
 */

"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { InteractiveButton } from "@/components/ui/interactive-button";

// Dynamically import Spline using the official Next.js wrapper
const Spline = dynamic(() => import("@splinetool/react-spline/next"), {
  ssr: false,
  loading: () => <SplineFallback />,
});

export interface SplineLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  scene: string;
  fallbackImageUrl?: string;
  className?: string;
}

export const SplineFallback: React.FC<{
  imageUrl?: string;
  onForceMount?: () => void;
  reason?: string;
}> = ({ imageUrl, onForceMount, reason }) => (
  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden z-10 group">
    {imageUrl ? (
      <Image
        fill
        priority
        loading="eager"
        sizes="(max-width: 768px) 100vw, 50vw"
        src={imageUrl}
        alt="3D Scene Fallback"
        className="object-cover opacity-60 filter blur-sm transition-opacity group-hover:opacity-40"
      />
    ) : (
      <div className="absolute inset-0 bg-[var(--color-elevated)] animate-pulse" />
    )}

    {/* Interactive Force Mount Overlay */}
    {onForceMount ? (
      <div className="relative z-20 flex flex-col items-center gap-3 p-6 text-center backdrop-blur-md bg-[var(--color-surface)]/80 border border-[var(--color-border)] shadow-[var(--shadow-subtle)] max-w-[80%]">
        <span className="font-mono text-xs text-[var(--color-signal-ochre)] font-bold tracking-widest uppercase">
          {reason || "SPATIAL CANVAS STANDBY"}
        </span>
        <p className="text-xs text-[var(--color-text-muted)] max-w-xs">
          3D WebGL interaction was paused to preserve system performance or due to buffer latency.
        </p>
        <InteractiveButton variant="primary" onClick={onForceMount} className="mt-2 text-xs py-1.5 px-4">
          Force Mount Interactive 3D →
        </InteractiveButton>
      </div>
    ) : (
      <div className="relative z-20 flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-signal-emerald)] border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-[var(--color-text-dimmed)] tracking-widest uppercase">
          LOADING SPATIAL ASSET...
        </span>
      </div>
    )}
  </div>
);

// Error Boundary to catch WebGL or MsgPack buffer parsing errors ("Data read, but end of buffer not reached")
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn("Spline WebGL runtime error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 w-full h-full z-10">
          {this.props.fallback}
        </div>
      );
    }
    return this.props.children;
  }
}

export const SplineLoader = React.forwardRef<HTMLDivElement, SplineLoaderProps>(
  ({ className, scene, fallbackImageUrl, ...props }, ref) => {
    const [isLowEnd, setIsLowEnd] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isTimedOut, setIsTimedOut] = React.useState(false);
    const [forceMount, setForceMount] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
      const checkDevice = () => {
        const isMobile = window.innerWidth < 768;
        const hardwareThreads = navigator.hardwareConcurrency || 4;
        if (isMobile || hardwareThreads <= 2) {
          setIsLowEnd(true);
        }
      };

      checkDevice();
      window.addEventListener("resize", checkDevice);
      return () => window.removeEventListener("resize", checkDevice);
    }, []);

    React.useEffect(() => {
      if (isLowEnd || forceMount) return;

      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setIsTimedOut(true);
        }
      }, 8000);

      return () => clearTimeout(timeoutRef.current);
    }, [isLowEnd, isLoading, forceMount]);

    const handleLoad = () => {
      clearTimeout(timeoutRef.current);
      setIsLoading(false);
    };

    const handleForceMount = () => {
      setIsLowEnd(false);
      setIsTimedOut(false);
      setForceMount(true);
      setIsLoading(true);
    };

    const showFallback = (!forceMount && isLowEnd) || (!forceMount && isTimedOut);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-full overflow-hidden [contain:strict] select-none pointer-events-auto",
          className
        )}
        {...props}
      >
        {showFallback ? (
          <SplineFallback
            imageUrl={fallbackImageUrl}
            onForceMount={handleForceMount}
            reason={isLowEnd ? "LOW-END HARDWARE DETECTED" : "CDN BUFFER TIMEOUT"}
          />
        ) : (
          <SplineErrorBoundary
            fallback={
              <SplineFallback
                imageUrl={fallbackImageUrl}
                onForceMount={handleForceMount}
                reason="WEBGL / MSGPACK BUFFER ERROR"
              />
            }
          >
            {isLoading && <SplineFallback imageUrl={fallbackImageUrl} />}
            <Spline
              scene={scene}
              onLoad={handleLoad}
              style={{ width: "100%", height: "100%" }}
            />
          </SplineErrorBoundary>
        )}
      </div>
    );
  }
);
SplineLoader.displayName = "SplineLoader";
