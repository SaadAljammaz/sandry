"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "./icons/ShoppingBagIcon";
import { useCart } from "@/lib/cart";
import { NotificationBell } from "./NotificationBell";
import { useLang, useT } from "@/lib/i18n";

export function Navbar({ onCartOpen }: { onCartOpen?: () => void }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const count = useCart((s) => s.count)();
  const isChef = session?.user?.role === "CHEF";
  const isOwner = session?.user?.role === "OWNER";
  const t = useT();
  const { lang, setLang } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isClient = session && !isChef && !isOwner;

  const navLinks = session
    ? isOwner
      ? [
          { href: "/owner/dashboard", label: t("nav.ownerDash") },
          { href: "/owner/users", label: t("nav.users") },
          { href: "/owner/purchases", label: t("nav.ownerPurchases") },
          { href: "/owner/guide", label: t("nav.guide") },
        ]
      : isChef
      ? [
          { href: "/chef/dashboard", label: t("nav.dashboard") },
          { href: "/chef/orders", label: t("nav.orders") },
          { href: "/chef/menu", label: t("nav.menu") },
          { href: "/chef/purchases", label: t("nav.purchases") },
          { href: "/chef/analytics", label: t("nav.analytics") },
        ]
      : [
          { href: "/client/menu", label: t("nav.menu") },
          { href: "/client/orders", label: t("nav.myOrders") },
        ]
    : [];

  return (
    <nav className="bg-white shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-sunroll font-bold text-rose-600">
              Sandry
            </span>
            <span className="hidden sm:block text-xs text-amber-600 font-medium uppercase tracking-widest">
              {t("brand.tagline")}
            </span>
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                {isChef && <NotificationBell />}
                {navLinks.map((link) => (
                  <NavLink key={link.href} href={link.href} current={pathname}>
                    {link.label}
                  </NavLink>
                ))}

                {isClient && onCartOpen && (
                  <button
                    onClick={onCartOpen}
                    className="relative p-2 text-rose-600 hover:text-rose-700"
                    aria-label="Open cart"
                  >
                    <ShoppingBagIcon className="w-6 h-6" />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {count}
                      </span>
                    )}
                  </button>
                )}

                <div className="flex items-center gap-3 ms-2 ps-4 border-s border-rose-100">
                  <span className="text-sm text-gray-600 hidden lg:block">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-medium"
              >
                {t("nav.signIn")}
              </Link>
            )}

            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Switch language"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>
          </div>

          {/* Mobile: cart icon + lang toggle + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            {isClient && onCartOpen && (
              <button
                onClick={onCartOpen}
                className="relative p-2 text-rose-600 hover:text-rose-700"
                aria-label="Open cart"
              >
                <ShoppingBagIcon className="w-6 h-6" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs font-bold px-2 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Switch language"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-rose-100 py-3 space-y-0.5">
            {session ? (
              <>
                {navLinks.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    href={link.href}
                    current={pathname}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </MobileNavLink>
                ))}
                <div className="pt-3 mt-2 border-t border-rose-100 flex items-center justify-between px-2">
                  <span className="text-sm text-gray-500">{session.user.name}</span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2 pb-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center text-sm px-4 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors font-medium"
                >
                  {t("nav.signIn")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
}) {
  const isActive = current === href || current.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        isActive
          ? "text-rose-600 border-b-2 border-rose-500 pb-0.5"
          : "text-gray-600 hover:text-rose-600"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  current,
  children,
  onClick,
}: {
  href: string;
  current: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const isActive = current === href || current.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive
          ? "bg-rose-50 text-rose-600"
          : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
      }`}
    >
      {children}
    </Link>
  );
}
