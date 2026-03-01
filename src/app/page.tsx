"use client";

import Link from "next/link";
import { useT, useLang } from "@/lib/i18n";

export default function HomePage() {
  const t = useT();
  const { lang, setLang } = useLang();

  const features = [
    { icon: "🍰", titleKey: "feat.sweets.title" as const, descKey: "feat.sweets.desc" as const },
    { icon: "🥐", titleKey: "feat.pastry.title" as const, descKey: "feat.pastry.desc" as const },
    { icon: "📦", titleKey: "feat.order.title" as const, descKey: "feat.order.desc" as const },
    { icon: "✨", titleKey: "feat.track.title" as const, descKey: "feat.track.desc" as const },
  ];

  const testimonials = [
    { quoteKey: "t1.quote" as const, nameKey: "t1.name" as const },
    { quoteKey: "t2.quote" as const, nameKey: "t2.name" as const },
    { quoteKey: "t3.quote" as const, nameKey: "t3.name" as const },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <span className="text-2xl font-sunroll font-bold text-rose-600">Sandry</span>
            <span className="hidden sm:inline ms-2 text-xs text-amber-600 font-medium uppercase tracking-widest">
              {t("brand.tagline")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-rose-600 transition-colors"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-medium"
            >
              {t("landing.getStarted")}
            </Link>
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
        <div className="inline-block bg-rose-100 text-rose-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
          {t("landing.badge")}
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
          {t("landing.hero1")} <br />
          <span className="text-rose-500">{t("landing.hero2")}</span> {t("landing.hero3")}
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          {t("landing.heroSub")}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/login"
            className="px-8 py-3.5 bg-rose-500 text-white rounded-2xl font-semibold text-base hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
          >
            {t("landing.orderNow")}
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3.5 bg-white text-rose-600 border border-rose-200 rounded-2xl font-semibold text-base hover:bg-rose-50 transition-colors"
          >
            {t("nav.signIn")}
          </Link>
        </div>

        {/* Floating emoji decorations */}
        <div className="mt-16 text-4xl sm:text-5xl flex justify-center gap-3 sm:gap-6 select-none">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>🍰</span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>🥐</span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>🍩</span>
          <span className="animate-bounce" style={{ animationDelay: "450ms" }}>🎂</span>
          <span className="animate-bounce" style={{ animationDelay: "600ms" }}>🍪</span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {t("landing.whySandry")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.titleKey}
              className="bg-white border border-rose-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-gray-500">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-rose-500 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            {t("landing.testimonials")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.nameKey} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
                <p className="text-sm leading-relaxed opacity-90 italic">&ldquo;{t(item.quoteKey)}&rdquo;</p>
                <p className="mt-4 font-semibold text-amber-200">{t(item.nameKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {t("landing.ctaTitle")}
        </h2>
        <p className="text-gray-500 mb-8">{t("landing.ctaSub")}</p>
        <Link
          href="/auth/login"
          className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-semibold text-lg hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 inline-block"
        >
          {t("landing.createAccount")}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100 py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} {t("landing.footer")}</p>
      </footer>
    </div>
  );
}
