# 📈 Sector Stock Dashboard

A full-stack, real-time Indian stock market analytics dashboard built with **Django + React**.


### Prerequisites
- Python 3.10+
- Node.js 18+
- Internet connection (for live yfinance data)

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

---

### Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

##  Usage

1. Open **http://localhost:5173** in your browser
2. Select a **Sector** (IT, Banking, Pharma, FMCG, Energy, Auto)
3. Select a **Company** from the dropdown
4. Select a **Period** (1 Month to 5 Years)
5. Click ** Analyze**
6. View real-time KPIs, technical indicators, and 5 interactive charts

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sectors/` | List all sectors |
| GET | `/api/companies/?sector=IT` | Companies for a sector |
| POST | `/api/analyze/` | Run stock analysis |

### POST /api/analyze/ Request
```json
{
  "symbol": "TCS.NS",
  "period": "1y"
}
```

### Response includes:
- `current_price`, `market_cap`, `pe_ratio`
- `rsi`, `volatility`, `ma20`, `ma50`
- `52_week_high`, `52_week_low`
- `graphs`: array of chart image URLs

---

## 📊 Generated Charts

- **Candlestick** — OHLCV price action
- **Moving Averages** — Price with MA20 & MA50 overlay
- **RSI** — 14-period RSI with overbought/oversold zones
- **Volume** — Daily volume bars (color-coded)
- **Volatility** — 20-day rolling standard deviation

Charts are saved to `backend/media/<SYMBOL>/<PERIOD>/` and served statically.

---

## 🏢 Supported Sectors & Companies

| Sector | Companies |
|--------|-----------|
| IT | TCS, Infosys, Wipro, HCL Tech, Tech Mahindra |
| Banking | HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak |
| Pharma | Sun Pharma, Dr. Reddy's, Cipla, Divi's, Aurobindo |
| FMCG | HUL, ITC, Nestle, Britannia, Dabur |
| Energy | Reliance, ONGC, NTPC, Power Grid, Coal India |
| Auto | Maruti, Tata Motors, Bajaj Auto, Hero MotoCorp, M&M |

---

## 🛠 Tech Stack

**Backend:** Django 4.2 · DRF · Pandas · NumPy · yfinance · Matplotlib · mplfinance

**Frontend:** React 18 · Vite · Tailwind CSS · Axios · Recharts


