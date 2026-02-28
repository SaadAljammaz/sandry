"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useT } from "@/lib/i18n";

interface AnalyticsData {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  monthRevenue: number;
  monthOrders: number;
  avgOrderValue: number;
  statusCounts: Record<string, number>;
  recentOrders: { day: string; count: number; revenue: number }[];
  topItems: { name: string; totalQty: number }[];
}

export default function ChefAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useT();

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

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

  const chartData = data.recentOrders.map((r) => ({
    day: new Date(r.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    orders: r.count,
    revenue: Number(r.revenue.toFixed(2)),
  }));

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t("analytics.title")}</h1>
          <p className="text-gray-500 mt-1">{t("analytics.sub")}</p>
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
            label={t("analytics.totalOrders")}
            value={data.totalOrders}
            icon="📦"
            color="blue"
          />
          <StatsCard
            label={t("analytics.avgOrder")}
            value={`$${data.avgOrderValue.toFixed(2)}`}
            icon="📊"
            color="amber"
          />
          <StatsCard
            label={t("analytics.thisMonth")}
            value={`$${data.monthRevenue.toFixed(2)}`}
            icon="📅"
            sub={`${data.monthOrders} ${t("analytics.orders")}`}
            color="rose"
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue over time */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("analytics.revChart")}
            </h2>
            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                {t("analytics.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [`$${val}`, t("analytics.totalRevenue")]} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ fill: "#f43f5e" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Orders per day */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {t("analytics.ordersChart")}
            </h2>
            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                {t("analytics.noData")}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
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
          {/* Top items */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              {t("analytics.topItems")}
            </h2>
            {data.topItems.length === 0 ? (
              <p className="text-gray-400 text-sm">{t("analytics.noData")}</p>
            ) : (
              <div className="space-y-3">
                {data.topItems.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="w-6 text-sm font-bold text-gray-400">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-gray-500">{item.totalQty} {t("analytics.sold")}</span>
                      </div>
                      <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full"
                          style={{
                            width: `${(item.totalQty / (data.topItems[0]?.totalQty || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order status breakdown */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">
              {t("analytics.byStatus")}
            </h2>
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
          </div>
        </div>
      </main>
    </div>
  );
}
