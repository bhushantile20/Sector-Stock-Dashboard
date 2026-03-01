import React, { useState, useEffect } from "react";
import { fetchSectors, fetchCompanies, analyzeStock } from "./api/stockApi";
import Dropdown from "./components/Dropdown";
import KPICard from "./components/KPICard";
import GraphGrid from "./components/GraphGrid";
import LoadingSpinner from "./components/LoadingSpinner";
import RSIGauge from "./components/RSIGauge";

const PERIOD_OPTIONS = [
  { label: "1 Month", value: "1mo" },
  { label: "3 Months", value: "3mo" },
  { label: "6 Months", value: "6mo" },
  { label: "1 Year", value: "1y" },
  { label: "5 Years", value: "5y" },
];

function fmt(val, prefix = "₹", decimals = 2) {
  if (val === null || val === undefined) return null;
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return `${prefix}${n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

function fmtPct(val) {
  if (val === null || val === undefined) return null;
  return `${(parseFloat(val) * 100).toFixed(2)}%`;
}

export default function App() {
  const [sectors, setSectors] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingSectors, setLoadingSectors] = useState(true);

  useEffect(() => {
    setLoadingSectors(true);
    fetchSectors()
      .then(setSectors)
      .catch(() => setError("Failed to load sectors."))
      .finally(() => setLoadingSectors(false));
  }, []);

  useEffect(() => {
    if (!selectedSector) {
      setCompanies([]);
      setSelectedSymbol("");
      return;
    }
    fetchCompanies(selectedSector)
      .then(setCompanies)
      .catch(() => setCompanies([]));
    setSelectedSymbol("");
    setResult(null);
  }, [selectedSector]);

  const handleAnalyze = async () => {
    if (!selectedSymbol || !selectedPeriod) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeStock(selectedSymbol, selectedPeriod);
      setResult(data);
    } catch (err) {
      setError(
        err?.response?.data?.error || "Analysis failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = selectedSymbol && selectedPeriod && !loading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                Sector Stock Dashboard
              </h1>
              <p className="text-slate-500 text-xs">Real-time Indian Market Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-slate-400 text-xs">NSE Live Data</span>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="bg-slate-800/40 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-wrap items-end gap-4">
            <Dropdown
              label="Sector"
              value={selectedSector}
              onChange={setSelectedSector}
              options={sectors.map((s) => ({ label: s, value: s }))}
              placeholder={loadingSectors ? "Loading..." : "Select Sector"}
              disabled={loadingSectors}
            />
            <Dropdown
              label="Company"
              value={selectedSymbol}
              onChange={setSelectedSymbol}
              options={companies.map((c) => ({ label: c.name, value: c.symbol }))}
              placeholder={selectedSector ? "Select Company" : "Select Sector First"}
              disabled={!selectedSector || companies.length === 0}
            />
            <Dropdown
              label="Period"
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={PERIOD_OPTIONS}
              placeholder="Select Period"
            />
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`
                px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 mt-0.5
                ${canAnalyze
                  ? "bg-sky-500 hover:bg-sky-400 text-white shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 active:translate-y-0 pulse-glow"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Analyzing...
                </span>
              ) : (
                "⚡ Analyze"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
            <span className="text-xl mt-0.5">⚠️</span>
            <div>
              <div className="font-semibold text-red-200">Error</div>
              <div className="text-sm mt-0.5">{error}</div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner message={`Analyzing ${selectedSymbol}...`} />}

        {/* Empty State */}
        {!loading && !result && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-slate-300 text-xl font-semibold mb-2">
              Ready for Analysis
            </h2>
            <p className="text-slate-500 text-sm max-w-md">
              Select a sector, company, and time period above, then click{" "}
              <span className="text-sky-400 font-medium">Analyze</span> to view
              real-time stock analytics, technical indicators, and interactive charts.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 text-center">
              {["📈 Live Data", "🔬 Technical Analysis", "📊 Visual Charts"].map((item) => (
                <div key={item} className="bg-slate-800 rounded-xl px-5 py-4 border border-slate-700">
                  <div className="text-slate-300 text-sm font-medium">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{result.company_name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-sky-900/50 text-sky-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-sky-700/50">
                      {result.sector}
                    </span>
                    <span className="text-slate-500 text-xs">{result.symbol}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500 text-xs">
                      Period: {PERIOD_OPTIONS.find((p) => p.value === result.period)?.label}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-400">
                    {result.current_price ? fmt(result.current_price) : "N/A"}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">Current Market Price</div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Key Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <KPICard
                  label="Current Price"
                  value={fmt(result.current_price)}
                  icon="💰"
                  color="green"
                />
                <KPICard
                  label="Market Cap"
                  value={result.market_cap}
                  icon="🏦"
                  color="blue"
                />
                <KPICard
                  label="P/E Ratio"
                  value={result.pe_ratio ? result.pe_ratio.toFixed(2) : null}
                  icon="📐"
                  color="purple"
                />
                <KPICard
                  label="RSI (14)"
                  value={result.rsi ? result.rsi.toFixed(1) : null}
                  icon="🔄"
                  color={
                    result.rsi >= 70 ? "red" : result.rsi <= 30 ? "blue" : "yellow"
                  }
                  subtitle={
                    result.rsi >= 70
                      ? "Overbought"
                      : result.rsi <= 30
                      ? "Oversold"
                      : "Neutral"
                  }
                />
                <KPICard
                  label="Volatility"
                  value={fmtPct(result.volatility)}
                  icon="⚡"
                  color="orange"
                  subtitle="20-day std dev"
                />
                <KPICard
                  label="MA20"
                  value={fmt(result.ma20)}
                  icon="📉"
                  color="yellow"
                />
                <KPICard
                  label="52W High"
                  value={fmt(result["52_week_high"])}
                  icon="🔺"
                  color="green"
                />
                <KPICard
                  label="52W Low"
                  value={fmt(result["52_week_low"])}
                  icon="🔻"
                  color="red"
                />
              </div>
            </div>

            {/* RSI Gauge + MA Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <RSIGauge rsi={result.rsi} />

              {/* MA Comparison */}
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 col-span-1 lg:col-span-2">
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-4">
                  Moving Average Summary
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Current Price", val: result.current_price, color: "#22c55e" },
                    { label: "20-Day MA", val: result.ma20, color: "#eab308" },
                    { label: "50-Day MA", val: result.ma50, color: "#a855f7" },
                  ].map(({ label, val, color }) => {
                    const maxVal = Math.max(
                      result.current_price || 0,
                      result.ma20 || 0,
                      result.ma50 || 0
                    );
                    const pct = maxVal > 0 ? ((val || 0) / maxVal) * 100 : 0;
                    return (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{label}</span>
                          <span style={{ color }}>{val ? fmt(val) : "N/A"}</span>
                        </div>
                        <div className="bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Charts */}
            <div>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Technical Charts
              </h3>
              <GraphGrid graphs={result.graphs} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6 text-center text-slate-600 text-xs">
        Sector Stock Dashboard • Data via Yahoo Finance (yfinance) • For informational purposes only
      </footer>
    </div>
  );
}
