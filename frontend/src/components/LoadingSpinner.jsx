import React from "react";

export default function LoadingSpinner({ message = "Analyzing..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-sky-300 animate-spin" style={{ animationDuration: "0.7s", animationDirection: "reverse" }}></div>
      </div>
      <div className="text-slate-400 text-sm font-medium animate-pulse">{message}</div>
      <div className="text-slate-600 text-xs">Fetching real-time data & generating charts...</div>
    </div>
  );
}
