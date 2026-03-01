"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT, useLang } from "@/lib/i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const t = useT();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t("login.error"));
      setLoading(false);
      return;
    }

    // Fetch session to determine role redirect
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "OWNER") {
      router.push("/owner/dashboard");
    } else if (role === "CHEF") {
      router.push("/chef/dashboard");
    } else if (role === "CLIENT") {
      router.push("/client/menu");
    } else {
      router.push(callbackUrl);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-rose-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {t("login.title")}
      </h2>
      <p className="text-gray-500 text-sm mb-6">{t("login.sub")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your username"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("login.password")}
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60 mt-2"
        >
          {loading ? t("login.submitting") : t("login.submit")}
        </button>
      </form>

    </div>
  );
}

function LoginPageInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useT();
  const { lang, setLang } = useLang();

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = session?.user?.role;
    if (role === "OWNER") router.replace("/owner/dashboard");
    else if (role === "CHEF") router.replace("/chef/dashboard");
    else router.replace("/client/menu");
  }, [status, session, router]);

  if (status === "loading" || status === "authenticated") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-sunroll font-bold text-rose-600">Sandry</span>
            <span className="hidden sm:inline ms-2 text-xs text-amber-600 font-medium uppercase tracking-widest">
              {t("brand.tagline")}
            </span>
          </Link>
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-sunroll text-4xl font-bold text-rose-600">Sandry</h1>
          <p className="text-amber-600 text-sm font-medium uppercase tracking-widest mt-1">
            {t("brand.tagline")}
          </p>
        </div>

        <Suspense fallback={<div className="bg-white rounded-3xl shadow-xl p-8 animate-pulse h-96" />}>
          <LoginForm />
        </Suspense>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageInner />;
}
