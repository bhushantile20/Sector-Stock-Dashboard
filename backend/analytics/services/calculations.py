import pandas as pd
import numpy as np


def calculate_moving_averages(df: pd.DataFrame) -> pd.DataFrame:
    """Add MA20 and MA50 columns to the dataframe."""
    df = df.copy()
    df["MA20"] = df["Close"].rolling(window=20).mean()
    df["MA50"] = df["Close"].rolling(window=50).mean()
    return df


def calculate_rsi(df: pd.DataFrame, period: int = 14) -> pd.DataFrame:
    """Add RSI column to the dataframe."""
    df = df.copy()
    delta = df["Close"].diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
    avg_loss = loss.ewm(com=period - 1, min_periods=period).mean()

    rs = avg_gain / avg_loss.replace(0, np.nan)
    df["RSI"] = 100 - (100 / (1 + rs))
    return df


def calculate_volatility(df: pd.DataFrame) -> pd.DataFrame:
    """Add daily returns and rolling volatility (20-day std of returns)."""
    df = df.copy()
    df["Daily_Return"] = df["Close"].pct_change()
    df["Volatility"] = df["Daily_Return"].rolling(window=20).std()
    return df


def get_summary_metrics(df: pd.DataFrame) -> dict:
    """Return scalar summary metrics from the enriched dataframe."""
    latest = df.iloc[-1]

    rsi_val = latest.get("RSI")
    ma20_val = latest.get("MA20")
    ma50_val = latest.get("MA50")
    vol_val = latest.get("Volatility")

    def fmt(val, decimals=2):
        if val is None or (isinstance(val, float) and np.isnan(val)):
            return None
        return round(float(val), decimals)

    return {
        "rsi": fmt(rsi_val),
        "ma20": fmt(ma20_val),
        "ma50": fmt(ma50_val),
        "volatility": fmt(vol_val, 4),
    }


def enrich_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Apply all calculations and return enriched dataframe."""
    df = calculate_moving_averages(df)
    df = calculate_rsi(df)
    df = calculate_volatility(df)
    return df
