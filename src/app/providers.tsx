"use client";

import { SessionProvider } from "next-auth/react";
import { LangProvider } from "@/components/LangProvider";
import { CartGuard } from "@/components/CartGuard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LangProvider>
        <CartGuard />
        {children}
      </LangProvider>
    </SessionProvider>
  );
}
