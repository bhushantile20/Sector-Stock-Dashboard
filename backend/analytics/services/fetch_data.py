import yfinance as yf
import pandas as pd


PERIOD_MAP = {
    "1mo": "1mo",
    "3mo": "3mo",
    "6mo": "6mo",
    "1y": "1y",
    "5y": "5y",
}


def fetch_stock_data(symbol: str, period: str) -> pd.DataFrame:
    """Fetch OHLCV data for the given symbol and period."""
    yf_period = PERIOD_MAP.get(period, "1y")
    ticker = yf.Ticker(symbol)
    df = ticker.history(period=yf_period)
    if df.empty:
        raise ValueError(f"No data found for symbol: {symbol}")
    df.index = pd.to_datetime(df.index)
    df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()
    return df


def fetch_stock_info(symbol: str) -> dict:
    """Fetch metadata/info for the given symbol."""
    ticker = yf.Ticker(symbol)
    info = ticker.info

    def safe_get(key, default=None):
        val = info.get(key, default)
        if val is None:
            return default
        return val

    market_cap = safe_get("marketCap")
    if market_cap:
        if market_cap >= 1_00_00_00_00_000:
            market_cap_str = f"₹{market_cap / 1_00_00_00_00_000:.2f}L Cr"
        elif market_cap >= 1_00_00_00_000:
            market_cap_str = f"₹{market_cap / 1_00_00_00_000:.2f} Cr"
        else:
            market_cap_str = f"₹{market_cap:,.0f}"
    else:
        market_cap_str = "N/A"

    return {
        "current_price": safe_get("currentPrice") or safe_get("regularMarketPrice"),
        "market_cap": market_cap_str,
        "pe_ratio": safe_get("trailingPE"),
        "52_week_high": safe_get("fiftyTwoWeekHigh"),
        "52_week_low": safe_get("fiftyTwoWeekLow"),
        "currency": safe_get("currency", "INR"),
        "long_name": safe_get("longName", symbol),
    }
