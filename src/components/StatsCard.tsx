type StatsCardColor = "slate" | "emerald" | "blue" | "amber" | "violet";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  color?: StatsCardColor;
}

const colorMap: Record<
  StatsCardColor,
  { bg: string; border: string; accent: string; badge: string }
> = {
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    accent: "text-slate-400",
    badge: "bg-slate-500/20 text-slate-300",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    accent: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    accent: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
  },
};

export default function StatsCard({
  label,
  value,
  change,
  trend,
  icon,
  color = "slate",
}: StatsCardProps) {
  const colors = colorMap[color] || colorMap.slate;
  const isPositive = trend === "up";

  return (
    <div
      className={`${colors.bg} border ${colors.border} rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:border-opacity-60 hover:shadow-lg hover:shadow-black/20`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-slate-100 mb-2">{value}</p>
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}
        >
          <span className="mr-1">{isPositive ? "↑" : "↓"}</span>
          {change}
        </div>
      </div>

      <div
        className={`h-1 w-full rounded-full ${colors.bg} border ${colors.border}`}
      >
        <div
          className={`h-full rounded-full ${colors.accent} opacity-60`}
          style={{ width: "65%" }}
        />
      </div>
    </div>
  );
}
