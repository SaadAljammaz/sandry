interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  color?: "rose" | "amber" | "green" | "blue";
}

const COLOR_MAP = {
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  green: "bg-green-50 text-green-600 border-green-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
};

export function StatsCard({ label, value, icon, sub, color = "rose" }: StatsCardProps) {
  return (
    <div className={`rounded-2xl border p-5 flex items-center gap-4 ${COLOR_MAP[color]}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
