"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { useT, useLang } from "@/lib/i18n";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useT();
  const lang = useLang((s) => s.lang);

  const handleOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            menuItemId: i.id,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          total: total(),
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to place order");
        return;
      }

      clearCart();
      setNotes("");
      onClose();
      router.push("/client/orders");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // RTL: drawer slides from left in Arabic, right in English
  const drawerPosition = lang === "ar" ? "left-0" : "right-0";
  const translateOut = lang === "ar" ? "-translate-x-full" : "translate-x-full";

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed ${drawerPosition} top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : translateOut
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("cart.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-rose-50 text-gray-500 hover:text-rose-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="text-sm">{t("cart.empty")}</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-rose-600 text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-rose-100 space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("cart.notesPlaceholder")}
              rows={2}
              className="w-full text-sm border border-rose-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">{t("cart.total")}</span>
              <span className="text-rose-600 text-xl font-bold">
                ${total().toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full py-3 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
            >
              {loading ? t("cart.placingOrder") : t("cart.placeOrder")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
