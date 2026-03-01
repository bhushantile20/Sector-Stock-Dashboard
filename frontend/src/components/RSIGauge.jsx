import React from "react";

export default function RSIGauge({ rsi }) {
  if (rsi === null || rsi === undefined) return null;

  const clamp = Math.min(Math.max(rsi, 0), 100);
  const angle = (clamp / 100) * 180 - 90;

  let color = "#22c55e";
  let label = "Neutral";
  if (rsi >= 70) { color = "#ef4444"; label = "Overbought"; }
  else if (rsi <= 30) { color = "#3b82f6"; label = "Oversold"; }

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col items-center">
      <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">
        RSI Gauge
      </div>
      <svg viewBox="0 0 120 70" className="w-40">
        <path d="M 10 65 A 55 55 0 0 1 110 65" fill="none" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
        <path d="M 10 65 A 55 55 0 0 1 110 65" fill="none" stroke="#1e3a5f" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(rsi / 100) * 172.8} 172.8`} />
        <line
          x1="60" y1="65"
          x2={60 + 40 * Math.cos(((angle - 90) * Math.PI) / 180)}
          y2={65 + 40 * Math.sin(((angle - 90) * Math.PI) / 180)}
          stroke={color} strokeWidth="3" strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="4" fill={color} />
        <text x="10" y="75" fill="#475569" fontSize="8">0</text>
        <text x="53" y="15" fill="#475569" fontSize="8">50</text>
        <text x="104" y="75" fill="#475569" fontSize="8">100</text>
      </svg>
      <div className="text-2xl font-bold" style={{ color }}>{rsi.toFixed(1)}</div>
      <div className="text-xs font-semibold mt-1" style={{ color }}>{label}</div>
    </div>
  );
}
