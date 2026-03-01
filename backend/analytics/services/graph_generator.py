import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import mplfinance as mpf
import pandas as pd
import numpy as np

DARK_BG = "#0f172a"
CARD_BG = "#1e293b"
ACCENT = "#38bdf8"
GREEN = "#22c55e"
RED = "#ef4444"
YELLOW = "#eab308"
TEXT = "#e2e8f0"
GRID = "#334155"


def get_output_dir(symbol: str, period: str, media_root: str) -> str:
    safe_symbol = symbol.replace("/", "_").replace("\\", "_")
    out_dir = os.path.join(media_root, safe_symbol, period)
    os.makedirs(out_dir, exist_ok=True)
    return out_dir


def get_media_path(symbol: str, period: str, filename: str) -> str:
    safe_symbol = symbol.replace("/", "_").replace("\\", "_")
    return f"{safe_symbol}/{period}/{filename}"


def generate_candlestick(df: pd.DataFrame, symbol: str, period: str, out_dir: str) -> str:
    filename = "candlestick.png"
    filepath = os.path.join(out_dir, filename)

    mc = mpf.make_marketcolors(
        up=GREEN, down=RED,
        edge="inherit",
        wick="inherit",
        volume={"up": GREEN, "down": RED},
    )
    s = mpf.make_mpf_style(
        marketcolors=mc,
        facecolor=DARK_BG,
        edgecolor=CARD_BG,
        figcolor=DARK_BG,
        gridcolor=GRID,
        gridstyle="--",
        gridaxis="both",
        y_on_right=False,
        rc={
            "axes.labelcolor": TEXT,
            "xtick.color": TEXT,
            "ytick.color": TEXT,
            "axes.titlecolor": TEXT,
        },
    )

    mpf.plot(
        df[["Open", "High", "Low", "Close", "Volume"]],
        type="candle",
        style=s,
        title=f"\n{symbol} — Candlestick ({period})",
        volume=True,
        savefig=dict(fname=filepath, dpi=130, bbox_inches="tight"),
        figsize=(12, 7),
    )
    plt.close("all")
    return filename


def generate_moving_average(df: pd.DataFrame, symbol: str, period: str, out_dir: str) -> str:
    filename = "moving_average.png"
    filepath = os.path.join(out_dir, filename)

    fig, ax = plt.subplots(figsize=(12, 5), facecolor=DARK_BG)
    ax.set_facecolor(CARD_BG)

    ax.plot(df.index, df["Close"], color=ACCENT, linewidth=1.5, label="Close", alpha=0.9)
    if "MA20" in df.columns:
        ax.plot(df.index, df["MA20"], color=YELLOW, linewidth=1.5, label="MA20", linestyle="--")
    if "MA50" in df.columns:
        ax.plot(df.index, df["MA50"], color="#a855f7", linewidth=1.5, label="MA50", linestyle="--")

    ax.set_title(f"{symbol} — Moving Averages ({period})", color=TEXT, fontsize=13, pad=10)
    ax.set_xlabel("Date", color=TEXT)
    ax.set_ylabel("Price (₹)", color=TEXT)
    ax.tick_params(colors=TEXT)
    ax.grid(color=GRID, linestyle="--", linewidth=0.5)
    ax.legend(facecolor=CARD_BG, edgecolor=GRID, labelcolor=TEXT)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b '%y"))
    fig.autofmt_xdate()

    for spine in ax.spines.values():
        spine.set_edgecolor(GRID)

    plt.tight_layout()
    fig.savefig(filepath, dpi=130, bbox_inches="tight", facecolor=DARK_BG)
    plt.close(fig)
    return filename


def generate_rsi(df: pd.DataFrame, symbol: str, period: str, out_dir: str) -> str:
    filename = "rsi.png"
    filepath = os.path.join(out_dir, filename)

    fig, ax = plt.subplots(figsize=(12, 4), facecolor=DARK_BG)
    ax.set_facecolor(CARD_BG)

    if "RSI" in df.columns:
        rsi = df["RSI"].dropna()
        ax.plot(rsi.index, rsi, color=ACCENT, linewidth=1.5, label="RSI (14)")
        ax.axhline(70, color=RED, linestyle="--", linewidth=1, label="Overbought (70)")
        ax.axhline(30, color=GREEN, linestyle="--", linewidth=1, label="Oversold (30)")
        ax.fill_between(rsi.index, rsi, 70, where=(rsi >= 70), alpha=0.15, color=RED)
        ax.fill_between(rsi.index, rsi, 30, where=(rsi <= 30), alpha=0.15, color=GREEN)
        ax.set_ylim(0, 100)

    ax.set_title(f"{symbol} — RSI ({period})", color=TEXT, fontsize=13, pad=10)
    ax.set_xlabel("Date", color=TEXT)
    ax.set_ylabel("RSI", color=TEXT)
    ax.tick_params(colors=TEXT)
    ax.grid(color=GRID, linestyle="--", linewidth=0.5)
    ax.legend(facecolor=CARD_BG, edgecolor=GRID, labelcolor=TEXT)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b '%y"))
    fig.autofmt_xdate()

    for spine in ax.spines.values():
        spine.set_edgecolor(GRID)

    plt.tight_layout()
    fig.savefig(filepath, dpi=130, bbox_inches="tight", facecolor=DARK_BG)
    plt.close(fig)
    return filename


def generate_volume(df: pd.DataFrame, symbol: str, period: str, out_dir: str) -> str:
    filename = "volume.png"
    filepath = os.path.join(out_dir, filename)

    fig, ax = plt.subplots(figsize=(12, 4), facecolor=DARK_BG)
    ax.set_facecolor(CARD_BG)

    colors = [GREEN if c >= o else RED for c, o in zip(df["Close"], df["Open"])]
    ax.bar(df.index, df["Volume"], color=colors, alpha=0.8, width=1.5)

    ax.set_title(f"{symbol} — Volume ({period})", color=TEXT, fontsize=13, pad=10)
    ax.set_xlabel("Date", color=TEXT)
    ax.set_ylabel("Volume", color=TEXT)
    ax.tick_params(colors=TEXT)
    ax.grid(color=GRID, linestyle="--", linewidth=0.5, axis="y")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b '%y"))
    fig.autofmt_xdate()

    for spine in ax.spines.values():
        spine.set_edgecolor(GRID)

    plt.tight_layout()
    fig.savefig(filepath, dpi=130, bbox_inches="tight", facecolor=DARK_BG)
    plt.close(fig)
    return filename


def generate_volatility(df: pd.DataFrame, symbol: str, period: str, out_dir: str) -> str:
    filename = "volatility.png"
    filepath = os.path.join(out_dir, filename)

    fig, ax = plt.subplots(figsize=(12, 4), facecolor=DARK_BG)
    ax.set_facecolor(CARD_BG)

    if "Volatility" in df.columns:
        vol = df["Volatility"].dropna()
        ax.plot(vol.index, vol, color="#f97316", linewidth=1.5, label="20-day Volatility")
        ax.fill_between(vol.index, vol, alpha=0.15, color="#f97316")

    ax.set_title(f"{symbol} — Volatility ({period})", color=TEXT, fontsize=13, pad=10)
    ax.set_xlabel("Date", color=TEXT)
    ax.set_ylabel("Std Dev of Returns", color=TEXT)
    ax.tick_params(colors=TEXT)
    ax.grid(color=GRID, linestyle="--", linewidth=0.5)
    ax.legend(facecolor=CARD_BG, edgecolor=GRID, labelcolor=TEXT)
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b '%y"))
    fig.autofmt_xdate()

    for spine in ax.spines.values():
        spine.set_edgecolor(GRID)

    plt.tight_layout()
    fig.savefig(filepath, dpi=130, bbox_inches="tight", facecolor=DARK_BG)
    plt.close(fig)
    return filename


def generate_all_graphs(df: pd.DataFrame, symbol: str, period: str, media_root: str) -> list:
    out_dir = get_output_dir(symbol, period, media_root)

    filenames = []
    filenames.append(generate_candlestick(df, symbol, period, out_dir))
    filenames.append(generate_moving_average(df, symbol, period, out_dir))
    filenames.append(generate_rsi(df, symbol, period, out_dir))
    filenames.append(generate_volume(df, symbol, period, out_dir))
    filenames.append(generate_volatility(df, symbol, period, out_dir))

    safe_symbol = symbol.replace("/", "_").replace("\\", "_")
    return [f"{safe_symbol}/{period}/{fn}" for fn in filenames]
