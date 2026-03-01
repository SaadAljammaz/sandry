"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { useT } from "@/lib/i18n";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  menuItem: { id: string; name: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: string; name: string; deletedAt: string | null };
  items: OrderItem[];
}

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"];
const FILTER_OPTIONS = ["ALL", ...STATUS_OPTIONS];

export default function ChefOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);
  const t = useT();

  const fetchOrders = async () => {
    const url = filter !== "ALL" ? `/api/orders?status=${filter}` : "/api/orders";
    const res = await fetch(url);
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : (data.orders ?? []));
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const filterLabel = (opt: string) => {
    if (opt === "ALL") return t("chefOrders.all");
    return t(`status.${opt}` as Parameters<typeof t>[0]);
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{t("chefOrders.title")}</h1>
          <p className="text-gray-500 mt-1">{t("chefOrders.sub")}</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === opt
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 border border-rose-200 hover:bg-rose-50"
              }`}
            >
              {filterLabel(opt)}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-3">
            <span className="text-5xl">📭</span>
            <p>{t("chefOrders.noOrders")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden"
              >
                {/* Order header row */}
                <div className="p-5 flex flex-wrap items-center gap-4">
                  {/* Client & items */}
                  <button
                    className="flex-1 text-start min-w-0"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <p className="font-semibold text-gray-900">
                      {order.client.name}
                      {order.client.deletedAt && (
                        <span className="ms-2 text-xs text-gray-400 font-normal">(Deleted)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </button>

                  {/* Amount */}
                  <p className="font-bold text-rose-600 text-lg shrink-0">
                    ${order.total.toFixed(2)}
                  </p>

                  {/* Status badge */}
                  <StatusBadge status={order.status} />

                  {/* Status changer */}
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-sm border border-rose-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>

                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${expanded === order.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded items */}
                {expanded === order.id && (
                  <div className="border-t border-rose-100 px-5 py-4 bg-rose-50/40">
                    {order.notes && (
                      <p className="text-sm italic text-gray-500 mb-3">
                        📝 {t("chefOrders.note")}: {order.notes}
                      </p>
                    )}
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.menuItem.name}{" "}
                            <span className="text-gray-400">× {item.quantity}</span>
                          </span>
                          <span className="font-medium">
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
