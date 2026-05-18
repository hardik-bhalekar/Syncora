"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { InteractiveButton } from "@/components/ui/interactive-button";

export const DashboardSignOut: React.FC = () => {
  return (
    <InteractiveButton
      variant="ghost"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-xs font-mono tracking-wider px-3 py-1 text-(--color-text-muted) hover:text-(--color-signal-crimson)"
    >
      Sign out
    </InteractiveButton>
  );
};
