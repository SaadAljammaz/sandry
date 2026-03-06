"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useT } from "@/lib/i18n";

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  imageUrl?: string | null;
  available: boolean;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "Cake",
  imageUrl: "",
  available: true,
};

const CATEGORIES = ["Cake", "Pastry", "Cookie", "Dessert", "Drink", "Other"];

export default function ChefMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  const fetchItems = async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setImagePreview(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description ?? "",
      price: String(item.price),
      category: item.category,
      imageUrl: item.imageUrl ?? "",
      available: item.available,
    });
    setImagePreview(item.imageUrl ?? null);
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      category: form.category,
      imageUrl: form.imageUrl || null,
      available: form.available,
    };

    const res = editItem
      ? await fetch(`/api/menu/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save");
      setSaving(false);
      return;
    }

    setModalOpen(false);
    fetchItems();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("chefMenu.deleteConfirm"))) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{t("chefMenu.title")}</h1>
            <p className="text-gray-500 mt-1">{t("chefMenu.sub")}</p>
          </div>
          <button
            onClick={openAdd}
            className="self-start sm:self-auto px-5 py-2.5 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> {t("chefMenu.addItem")}
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 bg-rose-50">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-4xl">🍰</div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                        {t("menu.unavailable")}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 start-2 text-xs bg-white/90 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <span className="font-bold text-rose-600">${item.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                      >
                        {t("chefMenu.edit")}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 text-xs border border-red-200 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        {t("chefMenu.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-rose-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {editItem ? t("chefMenu.editTitle") : t("chefMenu.addTitle")}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-rose-50 text-gray-400"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("chefMenu.name")} *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("chefMenu.namePlaceholder")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("chefMenu.price")} *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("chefMenu.category")} *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("chefMenu.description")}</label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={t("chefMenu.descPlaceholder")}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("chefMenu.imageUrl")}</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const compressed = await compressImage(file);
                      setImagePreview(compressed);
                      setForm((f) => ({ ...f, imageUrl: compressed }));
                    }}
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setForm((f) => ({ ...f, imageUrl: "" }));
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
                      >
                        ✕
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg hover:bg-black/70"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 text-sm text-gray-400 hover:border-rose-300 hover:text-rose-400 transition-colors flex flex-col items-center gap-1"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      Click to upload image
                    </button>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                      className="w-4 h-4 accent-rose-500"
                    />
                    <span className="text-sm text-gray-700">{t("chefMenu.available")}</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  {t("chefMenu.cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 disabled:opacity-60"
                >
                  {saving ? t("chefMenu.saving") : editItem ? t("chefMenu.save") : t("chefMenu.addBtn")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
