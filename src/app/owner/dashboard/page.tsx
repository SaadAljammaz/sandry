"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useT } from "@/lib/i18n";

interface OwnerStats {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  totalClients: number;
  totalPurchases: number;
  monthPurchases: number;
  actualProfit: number;
  actualMonthProfit: number;
  monthRevenue: number;
  monthProfit: number;
  monthOrders: number;
  todayOrders: number;
  avgOrderValue: number;
  avgProfit: number;
  newClientsThisMonth: number;
  statusCounts: Record<string, number>;
  recentDays: { day: string; revenue: number; profit: number; orders: number }[];
  topItems: {
    name: string;
    totalQty: number;
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }[];
}

interface ClientOption {
  id: string;
  name: string;
  email: string;
}

type Preset = "all" | "today" | "7d" | "30d" | "month" | "custom";

interface Filters {
  clientId: string;
  preset: Preset;
  customFrom: string;
  customTo: string;
}

const DEFAULT_FILTERS: Filters = { clientId: "", preset: "all", customFrom: "", customTo: "" };

function daysAgoStr(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function startOfMonthStr() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
}

function buildUrl(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.clientId) params.set("clientId", filters.clientId);

  if (filters.preset !== "all") {
    let from = "";
    let to = todayStr();
    switch (filters.preset) {
      case "today":   from = todayStr(); break;
      case "7d":      from = daysAgoStr(7); break;
      case "30d":     from = daysAgoStr(30); break;
      case "month":   from = startOfMonthStr(); break;
      case "custom":
        from = filters.customFrom;
        to   = filters.customTo;
        break;
    }
    if (from) params.set("from", from);
    if (to)   params.set("to", to);
  }

  return `/api/owner/stats?${params.toString()}`;
}

export default function OwnerDashboardPage() {
  const [data, setData] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const t = useT();

  // Load client list once
  useEffect(() => {
    fetch("/api/owner/users")
      .then((r) => r.json())
      .then((rows: { id: string; name: string; email: string; role: string }[]) => {
        setClients(rows.filter((u) => u.role === "CLIENT").map(({ id, name, email }) => ({ id, name, email })));
      });
  }, []);

  const fetchStats = useCallback((f: Filters) => {
    // Skip custom if dates not filled yet
    if (f.preset === "custom" && (!f.customFrom || !f.customTo)) return;
    setFetching(true);
    fetch(buildUrl(f))
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
        setFetching(false);
      });
  }, []);

  useEffect(() => { fetchStats(filters); }, [filters, fetchStats]);

  const setPreset = (preset: Preset) => setFilters((f) => ({ ...f, preset }));

  const PRESETS: { key: Preset; label: string }[] = [
    { key: "all",   label: t("owner.filterAllTime") },
    { key: "today", label: t("owner.filterToday") },
    { key: "7d",    label: t("owner.filter7d") },
    { key: "30d",   label: t("owner.filter30d") },
    { key: "month", label: t("owner.filterMonth") },
    { key: "custom",label: t("owner.filterCustom") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const overallMargin =
    data.totalRevenue > 0 ? Math.round((data.totalProfit / data.totalRevenue) * 100) : 0;

  const isDateFiltered = filters.preset !== "all";

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900">{t("owner.title")}</h1>
          <p className="text-gray-500 mt-1">{t("owner.sub")}</p>
        </div>

        {/* ── Filter bar ───────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm px-5 py-4 mb-8 flex flex-wrap items-end gap-4">
          {/* Client selector */}
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t("owner.filterClient")}
            </label>
            <select
              value={filters.clientId}
              onChange={(e) => setFilters((f) => ({ ...f, clientId: e.target.value }))}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
            >
              <option value="">{t("owner.filterAllClients")}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Date presets */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setPreset(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    filters.preset === key
                      ? "bg-rose-500 text-white border-rose-500"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-rose-50 hover:border-rose-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom date inputs */}
          {filters.preset === "custom" && (
            <div className="flex items-end gap-2 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">{t("owner.filterFrom")}</label>
                <input
                  type="date"
                  value={filters.customFrom}
                  onChange={(e) => setFilters((f) => ({ ...f, customFrom: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500">{t("owner.filterTo")}</label>
                <input
                  type="date"
                  value={filters.customTo}
                  onChange={(e) => setFilters((f) => ({ ...f, customTo: e.target.value }))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
          )}

          {/* Active filter badge + clear */}
          {(filters.clientId || filters.preset !== "all") && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="ms-auto self-end text-xs px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
            >
              ✕ Clear filters
            </button>
          )}

          {/* Subtle loading indicator */}
          {fetching && (
            <div className="ms-auto self-end text-xs text-gray-400 animate-pulse">Updating…</div>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatsCard
            label={t("analytics.totalRevenue")}
            value={`$${data.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="green"
          />
          <StatsCard
            label={t("owner.totalProfit")}
            value={`$${data.totalProfit.toFixed(2)}`}
            icon="📈"
            color="blue"
            sub={`${overallMargin}% ${t("owner.margin")}`}
          />
          <StatsCard
            label={t("analytics.totalOrders")}
            value={data.totalOrders}
            icon="📦"
            color="amber"
            sub={isDateFiltered ? undefined : `${data.todayOrders} today`}
          />
          <StatsCard
            label={t("owner.totalClients")}
            value={data.totalClients}
            icon="👥"
            color="rose"
            sub={`+${data.newClientsThisMonth} this month`}
          />
        </div>

        {/* Purchases & Actual Profit row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <StatsCard
            label={t("owner.totalPurchases")}
            value={`$${data.totalPurchases.toFixed(2)}`}
            icon="🛒"
            color="amber"
            sub={`$${data.monthPurchases.toFixed(2)} ${t("owner.thisMonth")}`}
          />
          <StatsCard
            label={t("owner.actualProfit")}
            value={`$${data.actualProfit.toFixed(2)}`}
            icon="📊"
            color="green"
            sub={t("owner.actualProfitSub")}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue vs Profit */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("owner.profitChart")}
            </h2>
            {data.recentDays.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                {t("analytics.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.recentDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#f43f5e" strokeWidth={2} dot={{ fill: "#f43f5e" }} />
                  <Line type="monotone" dataKey="profit"  name="Profit"  stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders per day */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("analytics.ordersChart")}
            </h2>
            {data.recentDays.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                {t("analytics.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.recentDays}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip formatter={(val) => [val, t("analytics.totalOrders")]} />
                  <Bar dataKey="orders" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top items by profit */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">{t("owner.topItems")}</h2>
            {data.topItems.length === 0 ? (
              <p className="text-gray-400 text-sm">{t("analytics.noData")}</p>
            ) : (
              <div className="space-y-3">
                {data.topItems.map((item, i) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <span className="w-6 text-sm font-bold text-gray-400 mt-0.5">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline text-sm mb-1">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-400 text-xs">{item.totalQty} {t("owner.sold")}</span>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 mb-1.5">
                        <span>{t("analytics.totalRevenue")}: <span className="text-gray-700 font-medium">${item.revenue.toFixed(2)}</span></span>
                        <span>{t("owner.cost")}: <span className="text-gray-700 font-medium">${item.cost.toFixed(2)}</span></span>
                        <span>{t("owner.profit")}: <span className="text-green-600 font-semibold">${item.profit.toFixed(2)}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-rose-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: `${item.margin}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 w-10 text-end">{item.margin}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">{t("analytics.byStatus")}</h2>
            <div className="space-y-3">
              {Object.entries(data.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {t(`status.${status}` as Parameters<typeof t>[0])}
                  </span>
                  <span className="font-bold text-gray-900">{count}</span>
                </div>
              ))}
              {Object.keys(data.statusCounts).length === 0 && (
                <p className="text-gray-400 text-sm">{t("analytics.noData")}</p>
              )}
            </div>

            {/* Month summary — only shown when not filtering by a date range */}
            {!isDateFiltered && (
              <div className="mt-6 pt-5 border-t border-rose-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">This Month</p>
                <div className="grid grid-cols-5 gap-2">
                  <div className="bg-rose-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-rose-600">{data.monthOrders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div className="bg-rose-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-rose-600">${data.monthRevenue.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-green-600">${data.monthProfit.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">Est. Profit</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-amber-600">${data.monthPurchases.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">{t("owner.purchases")}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-blue-600">${data.actualMonthProfit.toFixed(0)}</p>
                    <p className="text-xs text-gray-500">{t("owner.actualProfit")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
