"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatsCard } from "@/components/StatsCard";
import { useT } from "@/lib/i18n";

interface Purchase {
  id: string;
  description: string;
  amount: number;
  purchasedAt: string;
  receiptImage: string | null;
  createdAt: string;
}

const EMPTY_FORM = {
  description: "",
  amount: "",
  purchasedAt: new Date().toISOString().split("T")[0],
  receiptImage: null as string | null,
};

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1200 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.75));
    };
    img.src = url;
  });
}

export default function ChefPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = useT();

  const fetchPurchases = () => {
    fetch("/api/chef/purchases")
      .then((r) => r.json())
      .then((data) => {
        setPurchases(data.purchases ?? []);
        setAllTimeTotal(data.allTimeTotal ?? 0);
        setMonthTotal(data.monthTotal ?? 0);
        setLoading(false);
      });
  };

  useEffect(() => { fetchPurchases(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, purchasedAt: new Date().toISOString().split("T")[0] });
    setImagePreview(null);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Purchase) => {
    setEditId(p.id);
    setForm({
      description: p.description,
      amount: String(p.amount),
      purchasedAt: new Date(p.purchasedAt).toISOString().split("T")[0],
      receiptImage: p.receiptImage,
    });
    setImagePreview(p.receiptImage);
    setFormError("");
    setShowModal(true);
  };

  const clearImage = () => {
    setForm((f) => ({ ...f, receiptImage: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.description.trim() || !form.amount || !form.purchasedAt) {
      setFormError("All fields are required");
      return;
    }

    const parsedAmount = parseFloat(form.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be greater than 0");
      return;
    }

    setSaving(true);
    const payload = {
      description: form.description.trim(),
      amount: parsedAmount,
      purchasedAt: new Date(form.purchasedAt).toISOString(),
      receiptImage: form.receiptImage,
    };

    const url = editId ? `/api/chef/purchases/${editId}` : "/api/chef/purchases";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error ?? "Something went wrong");
      return;
    }

    setShowModal(false);
    fetchPurchases();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("purchases.deleteConfirm"))) return;
    await fetch(`/api/chef/purchases/${id}`, { method: "DELETE" });
    fetchPurchases();
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{t("purchases.title")}</h1>
            <p className="text-gray-500 mt-1">{t("purchases.sub")}</p>
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors"
          >
            + {t("purchases.addPurchase")}
          </button>
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
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">
                    {t("purchases.description")}
                  </th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">
                    {t("purchases.amount")}
                  </th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">
                    {t("purchases.date")}
                  </th>
                  <th className="text-end px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} className="border-b border-rose-50 last:border-0">
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
                        <span className="font-medium text-gray-900">{p.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-rose-600">${p.amount.toFixed(2)}</td>
                    <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">
                      {new Date(p.purchasedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                          {t("purchases.edit")}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                        >
                          {t("purchases.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editId ? t("purchases.editTitle") : t("purchases.addTitle")}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("purchases.description")}
                </label>
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder={t("purchases.descPlaceholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("purchases.amount")}
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("purchases.date")}
                </label>
                <input
                  type="date"
                  required
                  value={form.purchasedAt}
                  onChange={(e) => setForm({ ...form, purchasedAt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              {/* Receipt image — optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Photo{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>

                {imagePreview && (
                  <div className="mb-2 relative">
                    <img
                      src={imagePreview}
                      alt="receipt preview"
                      className="w-full max-h-48 object-contain rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 text-xs px-2 py-1 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border file:border-rose-200 file:text-sm file:font-medium file:text-rose-600 file:bg-white hover:file:bg-rose-50 file:transition-colors cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const compressed = await compressImage(file);
                    setForm((f) => ({ ...f, receiptImage: compressed }));
                    setImagePreview(compressed);
                  }}
                />
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {t("purchases.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
                >
                  {saving ? t("purchases.saving") : editId ? t("purchases.save") : t("purchases.addBtn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
