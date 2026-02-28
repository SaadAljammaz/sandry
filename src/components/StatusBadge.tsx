"use client";

import { useT } from "@/lib/i18n";

const STATUS_CLASSNAMES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  READY: "bg-green-100 text-green-700 border-green-200",
  DELIVERED: "bg-gray-100 text-gray-600 border-gray-200",
  CANCELLED: "bg-red-100 text-red-600 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  const t = useT();
  const key = `status.${status}` as Parameters<typeof t>[0];
  const label = STATUS_CLASSNAMES[status] ? t(key) : status;
  const className = STATUS_CLASSNAMES[status] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
}
