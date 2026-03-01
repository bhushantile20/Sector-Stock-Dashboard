SECTOR_DATA = {
    "IT": [
        {"name": "TCS", "symbol": "TCS.NS"},
        {"name": "Infosys", "symbol": "INFY.NS"},
        {"name": "Wipro", "symbol": "WIPRO.NS"},
        {"name": "HCL Technologies", "symbol": "HCLTECH.NS"},
        {"name": "Tech Mahindra", "symbol": "TECHM.NS"},
    ],
    "Banking": [
        {"name": "HDFC Bank", "symbol": "HDFCBANK.NS"},
        {"name": "ICICI Bank", "symbol": "ICICIBANK.NS"},
        {"name": "SBI", "symbol": "SBIN.NS"},
        {"name": "Axis Bank", "symbol": "AXISBANK.NS"},
        {"name": "Kotak Mahindra Bank", "symbol": "KOTAKBANK.NS"},
    ],
    "Pharma": [
        {"name": "Sun Pharma", "symbol": "SUNPHARMA.NS"},
        {"name": "Dr. Reddy's", "symbol": "DRREDDY.NS"},
        {"name": "Cipla", "symbol": "CIPLA.NS"},
        {"name": "Divi's Laboratories", "symbol": "DIVISLAB.NS"},
        {"name": "Aurobindo Pharma", "symbol": "AUROPHARMA.NS"},
    ],
    "FMCG": [
        {"name": "Hindustan Unilever", "symbol": "HINDUNILVR.NS"},
        {"name": "ITC", "symbol": "ITC.NS"},
        {"name": "Nestle India", "symbol": "NESTLEIND.NS"},
        {"name": "Britannia Industries", "symbol": "BRITANNIA.NS"},
        {"name": "Dabur India", "symbol": "DABUR.NS"},
    ],
    "Energy": [
        {"name": "Reliance Industries", "symbol": "RELIANCE.NS"},
        {"name": "ONGC", "symbol": "ONGC.NS"},
        {"name": "NTPC", "symbol": "NTPC.NS"},
        {"name": "Power Grid", "symbol": "POWERGRID.NS"},
        {"name": "Coal India", "symbol": "COALINDIA.NS"},
    ],
    "Auto": [
        {"name": "Maruti Suzuki", "symbol": "MARUTI.NS"},
        {"name": "Tata Motors", "symbol": "TATAMOTORS.NS"},
        {"name": "Bajaj Auto", "symbol": "BAJAJ-AUTO.NS"},
        {"name": "Hero MotoCorp", "symbol": "HEROMOTOCO.NS"},
        {"name": "Mahindra & Mahindra", "symbol": "M&M.NS"},
    ],
}


def get_all_sectors():
    return list(SECTOR_DATA.keys())


def get_companies_by_sector(sector):
    return SECTOR_DATA.get(sector, [])


def get_sector_for_symbol(symbol):
    for sector, companies in SECTOR_DATA.items():
        for company in companies:
            if company["symbol"] == symbol:
                return sector
    return "Unknown"


def get_company_name_for_symbol(symbol):
    for sector, companies in SECTOR_DATA.items():
        for company in companies:
            if company["symbol"] == symbol:
                return company["name"]
    return symbol
