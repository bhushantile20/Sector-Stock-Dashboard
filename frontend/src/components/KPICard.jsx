import React from "react";

const colorMap = {
  default: "border-slate-600",
  blue: "border-sky-500",
  green: "border-green-500",
  red: "border-red-500",
  yellow: "border-yellow-500",
  purple: "border-purple-500",
  orange: "border-orange-500",
};

const textColorMap = {
  default: "text-slate-200",
  blue: "text-sky-400",
  green: "text-green-400",
  red: "text-red-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
  orange: "text-orange-400",
};

export default function KPICard({ label, value, icon, color = "default", subtitle }) {
  return (
    <div
      className={`bg-slate-800 rounded-xl p-4 border-l-4 ${colorMap[color]} shadow-lg flex flex-col gap-1 hover:bg-slate-750 transition-colors`}
    >
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          {label}
        </span>
        {icon && <span className="text-xl opacity-70">{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${textColorMap[color]}`}>
        {value ?? <span className="text-slate-500 text-lg">N/A</span>}
      </div>
      {subtitle && (
        <div className="text-slate-500 text-xs">{subtitle}</div>
      )}
    </div>
  );
}
