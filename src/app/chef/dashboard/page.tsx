"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
import { StatsCard } from "@/components/StatsCard";
import { useT } from "@/lib/i18n";

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: { name: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  client: { name: string; deletedAt: string | null };
  items: OrderItem[];
}

interface Analytics {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  statusCounts: Record<string, number>;
}

const STATUS_OPTIONS = ["PENDING", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"];

export default function ChefDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useT();

  const fetchData = async () => {
    const [ordersRes, analyticsRes] = await Promise.all([
      fetch("/api/orders"),
      fetch("/api/analytics"),
    ]);
    const [ordersData, analyticsData] = await Promise.all([
      ordersRes.json(),
      analyticsRes.json(),
    ]);
    setOrders(Array.isArray(ordersData) ? ordersData.slice(0, 10) : []);
    setAnalytics(analyticsData);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{t("dash.title")}</h1>
          <p className="text-gray-500 mt-1">{t("dash.sub")}</p>
        </div>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatsCard
              label={t("dash.todayOrders")}
              value={analytics.todayOrders}
              icon="📋"
              color="rose"
            />
            <StatsCard
              label={t("dash.pending")}
              value={analytics.statusCounts?.PENDING ?? 0}
              icon="⏳"
              color="amber"
            />
            <StatsCard
              label={t("dash.monthRevenue")}
              value={`$${(analytics.monthRevenue ?? 0).toFixed(2)}`}
              icon="💰"
              color="green"
            />
            <StatsCard
              label={t("dash.totalOrders")}
              value={analytics.totalOrders}
              icon="📦"
              color="blue"
            />
          </div>
        )}

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm">
          <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{t("dash.recentOrders")}</h2>
            <a href="/chef/orders" className="text-sm text-rose-600 hover:underline">
              {t("dash.viewAll")}
            </a>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-rose-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p>{t("dash.noOrders")}</p>
            </div>
          ) : (
            <div className="divide-y divide-rose-50">
              {orders.map((order) => (
                <div key={order.id} className="px-4 sm:px-6 py-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {order.client.name}
                        {order.client.deletedAt && (
                          <span className="ms-1 text-xs text-gray-400 font-normal">(Deleted)</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {order.items.map((i) => `${i.menuItem.name} ×${i.quantity}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="font-bold text-rose-600">${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={order.status} />
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-sm border border-rose-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
