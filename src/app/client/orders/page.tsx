"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { useT } from "@/lib/i18n";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  menuItem: { id: string; name: string; imageUrl?: string | null };
}

interface Order {
  id: string;
  status: string;
  total: number;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<Record<string, number>>({});
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const t = useT();

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchOrders(); }, []);

  const openEdit = (order: Order) => {
    setEditingId(order.id);
    setEditNotes(order.notes ?? "");
    setEditQty(Object.fromEntries(order.items.map((i) => [i.id, i.quantity])));
    setEditError("");
    setExpanded(order.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const saveEdit = async (orderId: string) => {
    setSaving(true);
    setEditError("");
    const items = Object.entries(editQty).map(([id, quantity]) => ({ id, quantity }));

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, notes: editNotes }),
    });

    if (!res.ok) {
      const data = await res.json();
      setEditError(data.error ?? "Failed to save");
      setSaving(false);
      return;
    }

    setEditingId(null);
    setSaving(false);
    fetchOrders();
  };

  const editedTotal = (order: Order) =>
    order.items.reduce((sum, i) => sum + i.unitPrice * (editQty[i.id] ?? i.quantity), 0);

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{t("orders.title")}</h1>
            <p className="text-gray-500 mt-1">{t("orders.sub")}</p>
          </div>
          <Link
            href="/client/menu"
            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            {t("orders.newOrder")}
          </Link>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
            <span className="text-6xl">🛒</span>
            <p className="text-lg">{t("orders.empty")}</p>
            <Link
              href="/client/menu"
              className="text-rose-600 font-medium hover:underline text-sm"
            >
              {t("orders.browseMenu")}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isEditing = editingId === order.id;
              const isPending = order.status === "PENDING";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden"
                >
                  {/* Order header */}
                  <div className="w-full p-5 flex items-center justify-between">
                    <button
                      className="flex items-center gap-4 text-start flex-1 min-w-0"
                      onClick={() => {
                        if (!isEditing) setExpanded(expanded === order.id ? null : order.id);
                      }}
                    >
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="font-medium text-gray-900">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          {" · "}
                          <span className="text-rose-600 font-bold">
                            ${order.total.toFixed(2)}
                          </span>
                        </p>
                        {order.notes && !isEditing && (
                          <p className="text-xs text-gray-400 mt-0.5 italic">"{order.notes}"</p>
                        )}
                      </div>
                    </button>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={order.status} />

                      {/* Edit button — only for pending, non-editing orders */}
                      {isPending && !isEditing && (
                        <button
                          onClick={() => openEdit(order)}
                          className="px-3 py-1.5 text-xs font-medium border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          {t("orders.edit")}
                        </button>
                      )}

                      {/* Collapse chevron (hidden while editing) */}
                      {!isEditing && (
                        <button
                          onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                          className="p-1"
                        >
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              expanded === order.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Edit panel ── */}
                  {isEditing && (
                    <div className="border-t border-rose-100 px-5 py-4 bg-amber-50/40 space-y-4">
                      <p className="text-xs text-amber-700 font-medium">{t("orders.pendingHint")}</p>

                      {/* Item quantity controls */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <span className="text-sm text-gray-800 flex-1 truncate">
                              {item.menuItem.name}
                            </span>
                            <span className="text-sm text-rose-600 font-semibold w-20 text-end">
                              ${(item.unitPrice * (editQty[item.id] ?? item.quantity)).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() =>
                                  setEditQty((q) => ({
                                    ...q,
                                    [item.id]: Math.max(0, (q[item.id] ?? item.quantity) - 1),
                                  }))
                                }
                                className="w-7 h-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-lg leading-none"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-medium text-gray-900">
                                {editQty[item.id] ?? item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  setEditQty((q) => ({
                                    ...q,
                                    [item.id]: (q[item.id] ?? item.quantity) + 1,
                                  }))
                                }
                                className="w-7 h-7 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold text-lg leading-none"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* New total preview */}
                      <div className="flex justify-between text-sm font-semibold pt-2 border-t border-rose-100">
                        <span>{t("orders.total")}</span>
                        <span className="text-rose-600">${editedTotal(order).toFixed(2)}</span>
                      </div>

                      {/* Notes */}
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder={t("orders.notesPlaceholder")}
                        rows={2}
                        className="w-full text-sm border border-rose-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none bg-white"
                      />

                      {editError && (
                        <p className="text-red-500 text-sm">{editError}</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={cancelEdit}
                          className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                        >
                          {t("orders.cancelEdit")}
                        </button>
                        <button
                          onClick={() => saveEdit(order.id)}
                          disabled={saving}
                          className="flex-1 py-2 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
                        >
                          {saving ? t("orders.saving") : t("orders.saveEdit")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Expanded read-only view ── */}
                  {!isEditing && expanded === order.id && (
                    <div className="border-t border-rose-100 px-5 py-4 bg-rose-50/40">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {item.menuItem.name}{" "}
                              <span className="text-gray-400">× {item.quantity}</span>
                            </span>
                            <span className="font-medium text-gray-900">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-rose-100 flex justify-between font-semibold text-sm">
                        <span>{t("orders.total")}</span>
                        <span className="text-rose-600">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
