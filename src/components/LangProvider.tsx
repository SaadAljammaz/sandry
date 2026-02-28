"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useLang((s) => s.lang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return <>{children}</>;
}
