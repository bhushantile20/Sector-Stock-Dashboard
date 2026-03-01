import React from "react";

export default function Dropdown({ label, value, onChange, options, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          bg-slate-800 border border-slate-600 text-slate-200 rounded-lg px-3 py-2.5
          text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
          transition-all cursor-pointer min-w-[180px]
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-slate-500"}
        `}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
