import React, { useState } from "react";

const GRAPH_LABELS = {
  candlestick: "📊 Candlestick Chart",
  moving_average: "📈 Moving Averages",
  rsi: "🔄 RSI Indicator",
  volume: "📦 Volume",
  volatility: "⚡ Volatility",
};

function getGraphLabel(url) {
  for (const key of Object.keys(GRAPH_LABELS)) {
    if (url.includes(key)) return GRAPH_LABELS[key];
  }
  return "Chart";
}

export default function GraphGrid({ graphs }) {
  const [expanded, setExpanded] = useState(null);

  if (!graphs || graphs.length === 0) {
    return (
      <div className="text-slate-500 text-center py-10 text-sm">
        No graphs generated.
      </div>
    );
  }

  return (
    <>
      {expanded !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setExpanded(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-white font-semibold text-lg">
                {getGraphLabel(graphs[expanded])}
              </span>
              <button
                onClick={() => setExpanded(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            <img
              src={graphs[expanded]}
              alt="Expanded chart"
              className="w-full rounded-xl border border-slate-600"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {graphs.map((url, idx) => (
          <div
            key={idx}
            className={`bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-sky-500/40 transition-colors ${
              idx === 0 ? "lg:col-span-2" : ""
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <span className="text-slate-300 text-sm font-semibold">
                {getGraphLabel(url)}
              </span>
              <button
                onClick={() => setExpanded(idx)}
                className="text-slate-500 hover:text-sky-400 text-xs transition-colors"
                title="Expand"
              >
                ⤢ Expand
              </button>
            </div>
            <div className="p-3">
              <img
                src={url}
                alt={getGraphLabel(url)}
                className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setExpanded(idx)}
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='300' style='background:%231e293b'><text x='50%25' y='50%25' fill='%23475569' dominant-baseline='middle' text-anchor='middle' font-size='14'>Chart not available</text></svg>";
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
