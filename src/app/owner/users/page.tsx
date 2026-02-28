"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { useT } from "@/lib/i18n";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "CHEF" | "CLIENT" | "OWNER";
  active: boolean;
  createdAt: string;
  _count: { orders: number };
}

const ROLE_COLORS: Record<string, string> = {
  OWNER: "bg-amber-100 text-amber-800",
  CHEF: "bg-rose-100 text-rose-700",
  CLIENT: "bg-gray-100 text-gray-600",
};

const EMPTY_FORM = { name: "", email: "", password: "", role: "CLIENT" as "CHEF" | "CLIENT" };

export default function OwnerUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);
  const t = useT();

  const fetchUsers = () => {
    fetch("/api/owner/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchUsers(); }, []);

  const update = async (id: string, payload: { role?: string; active?: boolean }) => {
    setActionLoading(id);
    await fetch(`/api/owner/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setActionLoading(null);
    fetchUsers();
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setActionLoading(id);
    const res = await fetch(`/api/owner/users/${id}`, { method: "DELETE" });
    setActionLoading(null);
    if (!res.ok) {
      const data = await res.json();
      alert(data.error ?? "Failed to delete user");
      return;
    }
    fetchUsers();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    const res = await fetch("/api/owner/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setCreating(false);

    if (!res.ok) {
      setFormError(res.status === 409 ? t("owner.emailTaken") : data.error ?? "Failed");
      return;
    }

    setShowModal(false);
    setForm(EMPTY_FORM);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{t("owner.users")}</h1>
            <p className="text-gray-500 mt-1">{t("owner.usersSub")}</p>
          </div>
          <button
            onClick={() => { setForm(EMPTY_FORM); setFormError(""); setShowModal(true); }}
            className="shrink-0 px-4 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors"
          >
            + {t("owner.createUser")}
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rose-100 bg-rose-50/60">
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Orders</th>
                  <th className="text-start px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Joined</th>
                  <th className="text-end px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isMe = user.id === session?.user?.id;
                  const isOwner = user.role === "OWNER";
                  const busy = actionLoading === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`border-b border-rose-50 last:border-0 ${
                        !user.active ? "opacity-50" : ""
                      }`}
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {user.name}
                        {isMe && (
                          <span className="ms-2 text-xs text-rose-500">(you)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden sm:table-cell">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`text-xs font-semibold ${user.active ? "text-green-600" : "text-gray-400"}`}>
                          {user.active ? t("owner.active") : t("owner.inactive")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 hidden lg:table-cell">
                        {user._count.orders}
                      </td>
                      <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        {isOwner ? (
                          <span className="text-xs text-gray-300">—</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {!isMe && (
                              <button
                                disabled={busy}
                                onClick={() => update(user.id, { active: !user.active })}
                                className={`text-xs px-2.5 py-1 rounded-lg border disabled:opacity-50 transition-colors ${
                                  user.active
                                    ? "border-red-200 text-red-500 hover:bg-red-50"
                                    : "border-green-200 text-green-600 hover:bg-green-50"
                                }`}
                              >
                                {busy ? "..." : user.active ? t("owner.deactivate") : t("owner.activate")}
                              </button>
                            )}
                            {!isMe && (
                              <button
                                disabled={busy}
                                onClick={() => deleteUser(user.id, user.name)}
                                className="text-xs px-2.5 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                              >
                                {busy ? "..." : "Delete"}
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Create User Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t("owner.createUser")}</h2>
            <p className="text-sm text-gray-500 mb-6">{t("owner.createUserSub")}</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="username"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("owner.userEmail")}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("owner.userPassword")}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("owner.userRole")}
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as "CHEF" | "CLIENT" })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white"
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="CHEF">CHEF</option>
                </select>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-60"
                >
                  {creating ? t("owner.creating") : t("owner.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
