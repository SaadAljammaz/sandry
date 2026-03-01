"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { useT } from "@/lib/i18n";

interface Chef {
  id: string;
  name: string;
}

interface Purchase {
  id: string;
  description: string;
  amount: number;
  purchasedAt: string;
  receiptImage: string | null;
  chef: { id: string; name: string };
}

export default function OwnerPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [selectedChef, setSelectedChef] = useState("");
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const t = useT();

  const fetchPurchases = (chefId: string) => {
    const url = chefId
      ? `/api/owner/purchases?chefId=${chefId}`
      : "/api/owner/purchases";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setPurchases(data.purchases ?? []);
        setAllTimeTotal(data.allTimeTotal ?? 0);
        setMonthTotal(data.monthTotal ?? 0);
        if (data.chefs) setChefs(data.chefs);
        setLoading(false);
      });
  };

  useEffect(() => { fetchPurchases(selectedChef); }, [selectedChef]);

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{t("ownerPurchases.title")}</h1>
          <p className="text-gray-500 mt-1">{t("ownerPurchases.sub")}</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatsCard
            label={t("purchases.thisMonth")}
            value={`$${monthTotal.toFixed(2)}`}
            icon="🛒"
            color="amber"
          />
          <StatsCard
            label={t("purchases.allTime")}
            value={`$${allTimeTotal.toFixed(2)}`}
            icon="💸"
            color="rose"
          />
        </div>

        {/* Chef filter */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm px-5 py-4 mb-6 flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
            {t("ownerPurchases.filterChef")}
          </label>
          <select
            value={selectedChef}
            onChange={(e) => { setSelectedChef(e.target.value); setLoading(true); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
          >
            <option value="">{t("ownerPurchases.allChefs")}</option>
            {chefs.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Purchases table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-14 animate-pulse" />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">{t("purchases.empty")}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/60">
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                    {t("purchases.date")}
                  </th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">
                    {t("ownerPurchases.chef")}
                  </th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">
                    {t("purchases.description")}
                  </th>
                  <th className="text-end px-5 py-3 font-semibold text-gray-600">
                    {t("purchases.amount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-rose-50 last:border-0">
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                      {new Date(p.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                        {p.chef.name}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.receiptImage && (
                          <button
                            type="button"
                            onClick={() => setLightboxImage(p.receiptImage!)}
                            className="shrink-0"
                            title="View receipt"
                          >
                            <img
                              src={p.receiptImage}
                              alt="receipt"
                              className="w-10 h-10 rounded-lg object-cover border border-gray-200 hover:opacity-80 transition-opacity"
                            />
                          </button>
                        )}
                        <span className="text-gray-900">{p.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-end font-bold text-rose-600">
                      ${p.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Receipt image lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-medium"
            >
              ✕ Close
            </button>
            <img
              src={lightboxImage}
              alt="receipt"
              className="w-full max-h-[85vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
