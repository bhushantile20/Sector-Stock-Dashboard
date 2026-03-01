from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .services.sector_data import (
    get_all_sectors,
    get_companies_by_sector,
    get_sector_for_symbol,
    get_company_name_for_symbol,
)
from .services.fetch_data import fetch_stock_data, fetch_stock_info
from .services.calculations import enrich_dataframe, get_summary_metrics
from .services.graph_generator import generate_all_graphs

import traceback


@api_view(["GET"])
def sectors_view(request):
    """Return list of all available sectors."""
    sectors = get_all_sectors()
    return Response({"sectors": sectors})


@api_view(["GET"])
def companies_view(request):
    """Return companies for the given sector query param."""
    sector = request.query_params.get("sector", "").strip()
    if not sector:
        return Response(
            {"error": "sector query parameter is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    companies = get_companies_by_sector(sector)
    if not companies:
        return Response(
            {"error": f"No companies found for sector: {sector}"},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response({"sector": sector, "companies": companies})


@api_view(["POST"])
def analyze_view(request):
    """Main analysis endpoint."""
    symbol = request.data.get("symbol", "").strip()
    period = request.data.get("period", "1y").strip()

    if not symbol:
        return Response(
            {"error": "symbol is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    valid_periods = ["1mo", "3mo", "6mo", "1y", "5y"]
    if period not in valid_periods:
        return Response(
            {"error": f"Invalid period. Choose from: {valid_periods}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Fetch OHLCV data
        df = fetch_stock_data(symbol, period)
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(
            {"error": f"Failed to fetch stock data: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        # Fetch info/metadata
        info = fetch_stock_info(symbol)
    except Exception as e:
        info = {
            "current_price": None,
            "market_cap": "N/A",
            "pe_ratio": None,
            "52_week_high": None,
            "52_week_low": None,
        }

    try:
        # Enrich with technical indicators
        df_enriched = enrich_dataframe(df)
        metrics = get_summary_metrics(df_enriched)
    except Exception as e:
        return Response(
            {"error": f"Calculation error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    try:
        # Generate all graphs
        graph_paths = generate_all_graphs(
            df_enriched, symbol, period, settings.MEDIA_ROOT
        )
        graph_urls = [f"/media/{path}" for path in graph_paths]
    except Exception as e:
        traceback.print_exc()
        graph_urls = []

    # Resolve company name and sector
    company_name = get_company_name_for_symbol(symbol)
    if company_name == symbol:
        company_name = info.get("long_name", symbol)
    sector = get_sector_for_symbol(symbol)

    current_price = info.get("current_price")
    if current_price is None and not df.empty:
        current_price = round(float(df["Close"].iloc[-1]), 2)

    response_data = {
        "company_name": company_name,
        "sector": sector,
        "symbol": symbol,
        "period": period,
        "current_price": current_price,
        "market_cap": info.get("market_cap", "N/A"),
        "pe_ratio": info.get("pe_ratio"),
        "52_week_high": info.get("52_week_high"),
        "52_week_low": info.get("52_week_low"),
        "rsi": metrics.get("rsi"),
        "volatility": metrics.get("volatility"),
        "ma20": metrics.get("ma20"),
        "ma50": metrics.get("ma50"),
        "graphs": graph_urls,
    }

    return Response(response_data)
