"use client";

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

  return (
    <nav className="bg-white shadow-sm border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-sunroll font-bold text-rose-600">
              Sandry
            </span>
            <span className="hidden sm:block text-xs text-amber-600 font-medium uppercase tracking-widest">
              {t("brand.tagline")}
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                {isOwner ? (
                  <>
                    <NavLink href="/owner/dashboard" current={pathname}>{t("nav.ownerDash")}</NavLink>
                    <NavLink href="/owner/users" current={pathname}>{t("nav.users")}</NavLink>
                  </>
                ) : isChef ? (
                  <>
                    <NavLink href="/chef/dashboard" current={pathname}>{t("nav.dashboard")}</NavLink>
                    <NavLink href="/chef/orders" current={pathname}>{t("nav.orders")}</NavLink>
                    <NavLink href="/chef/menu" current={pathname}>{t("nav.menu")}</NavLink>
                    <NavLink href="/chef/purchases" current={pathname}>{t("nav.purchases")}</NavLink>
                    <NavLink href="/chef/analytics" current={pathname}>{t("nav.analytics")}</NavLink>
                    <NotificationBell />
                  </>
                ) : (
                  <>
                    <NavLink href="/client/menu" current={pathname}>{t("nav.menu")}</NavLink>
                    <NavLink href="/client/orders" current={pathname}>{t("nav.myOrders")}</NavLink>
                    {onCartOpen && (
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
                  </>
                )}

                <div className="flex items-center gap-3 ms-2 ps-4 border-s border-rose-100">
                  <span className="text-sm text-gray-600 hidden sm:block">
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

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
              title="Switch language"
            >
              {lang === "en" ? "ع" : "EN"}
            </button>
          </div>
        </div>
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
