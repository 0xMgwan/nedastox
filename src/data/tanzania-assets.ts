/**
 * Tanzania Financial Markets — Asset Data
 *
 * STOCKS  — Live prices from DSE public JSON API (dse.co.tz/api/get/live/market/prices)
 *           Refreshed every 30 s via /api/stocks. Initial seed = latest EOD close.
 *           History fetched on-demand via /api/stocks/history?symbol=X&days=90.
 *
 * BONDS   — Bank of Tanzania (bot.go.tz) weighted-average auction yields, May 2026.
 *
 * FUNDS   — UTT AMIS published NAVs (utt-amis.co.tz), May 2026.
 *
 * FOREX   — Live cross rates via ExchangeRate-API (exchangerate-api.com), refreshed 60 s.
 */

export type AssetCategory = 'stock' | 'bond' | 'fund' | 'forex';
export type DataSource    = 'DSE_LIVE' | 'BOT_REF' | 'UTT_NAV' | 'LIVE';

export interface Asset {
  id:          string;
  symbol:      string;
  name:        string;
  category:    AssetCategory;
  source:      DataSource;
  price:       number;
  change:      number;
  changePct:   number;
  volume:      number;
  marketCap?:  number;
  high52w?:    number;
  low52w?:     number;
  yield?:      number;
  maturity?:   string;
  nav?:        number;
  currency:    string;
  sector?:     string;
  history:     PricePoint[];
  lastUpdated: string;
}

export interface PricePoint {
  date:    string;
  price:   number;
  volume?: number;
}

/** Generates plausible seed history — replaced by real history once fetched from DSE */
function seedHistory(basePrice: number, days = 90, vol = 0.018): PricePoint[] {
  const pts: PricePoint[] = [];
  let p = basePrice * (0.88 + Math.random() * 0.12);
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    p = Math.max(p + (Math.random() - 0.48) * vol * p, p * 0.5);
    pts.push({ date: d.toISOString().split('T')[0], price: Math.round(p * 100) / 100, volume: Math.floor(Math.random() * 500_000 + 10_000) });
  }
  pts[pts.length - 1].price = basePrice;
  return pts;
}

// ─────────────────────────────────────────────────────────────────────────────
// DSE EQUITIES — all 26 listed securities
// Seed prices = latest DSE EOD close (17 May 2026). Live prices fetched via API.
// Sources: dse.co.tz/api/get/live/market/prices + /api/get/market/prices/for/range/duration
// ─────────────────────────────────────────────────────────────────────────────
export const DSE_STOCKS: Asset[] = [
  // ── Banking ────────────────────────────────────────────────────────────
  {
    id: 'crdb', symbol: 'CRDB', name: 'CRDB Bank Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 2710, change: 30, changePct: 1.11,
    volume: 415713, marketCap: 7_104_200_948_480,
    high52w: 3140, low52w: 790, lastUpdated: '2026-05-17',
    history: seedHistory(2710, 90, 0.022),
  },
  {
    id: 'nmb', symbol: 'NMB', name: 'National Microfinance Bank Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 13150, change: -40, changePct: -0.30,
    volume: 89420, marketCap: 6_555_000_000_000,
    high52w: 14840, low52w: 6000, lastUpdated: '2026-05-17',
    history: seedHistory(13150, 90, 0.018),
  },
  {
    id: 'kcb', symbol: 'KCB', name: 'Kenya Commercial Bank Limited (Tanzania)',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 1770, change: -10, changePct: -0.56,
    volume: 3846, marketCap: 5_227_798_400_000,
    high52w: 1830, low52w: 850, lastUpdated: '2026-05-17',
    history: seedHistory(1770, 90, 0.016),
  },
  {
    id: 'dcb', symbol: 'DCB', name: 'DCB Commercial Bank Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 595, change: -15, changePct: -2.52,
    volume: 31396, marketCap: 110_159_217_600,
    high52w: 835, low52w: 120, lastUpdated: '2026-05-17',
    history: seedHistory(595, 90, 0.03),
  },
  {
    id: 'mcb', symbol: 'MCB', name: 'Mwalimu Commercial Bank Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 1310, change: -110, changePct: -8.40,
    volume: 12000, marketCap: 76_662_900_800,
    high52w: 2430, low52w: 215, lastUpdated: '2026-05-17',
    history: seedHistory(1310, 90, 0.035),
  },
  {
    id: 'mkcb', symbol: 'MKCB', name: 'Mkombozi Commercial Bank Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 4460, change: -110, changePct: -2.47,
    volume: 8200, marketCap: 102_228_708_680,
    high52w: 5500, low52w: 590, lastUpdated: '2026-05-17',
    history: seedHistory(4460, 90, 0.03),
  },
  {
    id: 'mbp', symbol: 'MBP', name: 'Maendeleo Bank Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Banking',
    price: 2330, change: -30, changePct: -1.29,
    volume: 5355, marketCap: 66_575_229_240,
    high52w: 3100, low52w: 440, lastUpdated: '2026-05-17',
    history: seedHistory(2330, 90, 0.028),
  },
  // ── Consumer Goods ─────────────────────────────────────────────────────
  {
    id: 'tbl', symbol: 'TBL', name: 'Tanzania Breweries Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Consumer Goods',
    price: 10410, change: -150, changePct: -1.44,
    volume: 45200, marketCap: 3_027_275_206_380,
    high52w: 10900, low52w: 7150, lastUpdated: '2026-05-17',
    history: seedHistory(10410, 90, 0.014),
  },
  {
    id: 'tcc', symbol: 'TCC', name: 'Tanzania Cigarette Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Consumer Goods',
    price: 12830, change: -30, changePct: -0.23,
    volume: 18000, marketCap: 1_280_000_000_000,
    high52w: 17000, low52w: 9800, lastUpdated: '2026-05-17',
    history: seedHistory(12830, 90, 0.016),
  },
  {
    id: 'eabl', symbol: 'EABL', name: 'East African Breweries Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Consumer Goods',
    price: 4880, change: 0, changePct: 0,
    volume: 0, marketCap: 3_890_609_831_520,
    high52w: 5350, low52w: 3610, lastUpdated: '2026-05-17',
    history: seedHistory(4880, 90, 0.014),
  },
  // ── Materials ──────────────────────────────────────────────────────────
  {
    id: 'tpcc', symbol: 'TPCC', name: 'Tanzania Portland Cement Company Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Materials',
    price: 7310, change: 40, changePct: 0.55,
    volume: 32000, marketCap: 1_322_434_785_000,
    high52w: 7530, low52w: 4400, lastUpdated: '2026-05-17',
    history: seedHistory(7310, 90, 0.019),
  },
  {
    id: 'tccl', symbol: 'TCCL', name: 'Tanga Cement Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Materials',
    price: 2900, change: 0, changePct: 0,
    volume: 4200, marketCap: 561_578_616_900,
    high52w: 3580, low52w: 1680, lastUpdated: '2026-05-17',
    history: seedHistory(2900, 90, 0.022),
  },
  // ── Telecommunications ─────────────────────────────────────────────────
  {
    id: 'voda', symbol: 'VODA', name: 'Vodacom Tanzania Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Telecoms',
    price: 765, change: 10, changePct: 1.31,
    volume: 98000, marketCap: 1_702_400_228_000,
    high52w: 995, low52w: 480, lastUpdated: '2026-05-17',
    history: seedHistory(765, 90, 0.02),
  },
  // ── Transportation / Aviation ──────────────────────────────────────────
  {
    id: 'swis', symbol: 'SWIS', name: 'Swissport Tanzania Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Transportation',
    price: 2740, change: -100, changePct: -3.65,
    volume: 22000, marketCap: 95_760_000_000,
    high52w: 3310, low52w: 1440, lastUpdated: '2026-05-17',
    history: seedHistory(2740, 90, 0.025),
  },
  {
    id: 'pal', symbol: 'PAL', name: 'Precision Air Services Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Transportation',
    price: 415, change: -15, changePct: -3.61,
    volume: 58000, marketCap: 64_990_269_000,
    high52w: 880, low52w: 160, lastUpdated: '2026-05-17',
    history: seedHistory(415, 90, 0.04),
  },
  {
    id: 'ka', symbol: 'KA', name: 'Kenya Airways Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Transportation',
    price: 125, change: 0, changePct: 0,
    volume: 0, marketCap: 710_177_963_875,
    high52w: 165, low52w: 10, lastUpdated: '2026-05-17',
    history: seedHistory(125, 90, 0.05),
  },
  // ── Agriculture ────────────────────────────────────────────────────────
  {
    id: 'ttp', symbol: 'TTP', name: 'TATEPA Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Agriculture',
    price: 530, change: 0, changePct: 0,
    volume: 6500, marketCap: 50_380_307_520,
    high52w: 780, low52w: 120, lastUpdated: '2026-05-17',
    history: seedHistory(530, 90, 0.028),
  },
  // ── Energy ─────────────────────────────────────────────────────────────
  {
    id: 'swala', symbol: 'SWALA', name: 'Swala Oil and Gas (Tanzania) Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Energy',
    price: 450, change: 0, changePct: 0,
    volume: 0, marketCap: 47_790_729_450,
    high52w: 450, low52w: 450, lastUpdated: '2026-05-17',
    history: seedHistory(450, 90, 0.008),
  },
  // ── Financial Services ─────────────────────────────────────────────────
  {
    id: 'jhl', symbol: 'JHL', name: 'Jubilee Holdings Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Insurance',
    price: 8650, change: 0, changePct: 0,
    volume: 2100, marketCap: 626_891_017_500,
    high52w: 8650, low52w: 4210, lastUpdated: '2026-05-17',
    history: seedHistory(8650, 90, 0.015),
  },
  {
    id: 'nico', symbol: 'NICO', name: 'National Investment Company Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Insurance',
    price: 3470, change: 480, changePct: 13.83,
    volume: 9400, marketCap: 240_414_852_600,
    high52w: 3990, low52w: 790, lastUpdated: '2026-05-17',
    history: seedHistory(3470, 90, 0.04),
  },
  {
    id: 'dse', symbol: 'DSE', name: 'Dar es Salaam Stock Exchange Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Financial Services',
    price: 6310, change: 390, changePct: 6.18,
    volume: 1081, marketCap: 158_906_213_400,
    high52w: 7620, low52w: 2750, lastUpdated: '2026-05-17',
    history: seedHistory(6310, 90, 0.04),
  },
  {
    id: 'yetu', symbol: 'YETU', name: 'Yetu Microfinance Public Limited Company',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Financial Services',
    price: 510, change: 0, changePct: 0,
    volume: 0, marketCap: 6_177_575_940,
    high52w: 510, low52w: 510, lastUpdated: '2026-05-17',
    history: seedHistory(510, 90, 0.01),
  },
  // ── Media ──────────────────────────────────────────────────────────────
  {
    id: 'nmg', symbol: 'NMG', name: 'Nation Media Group Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Media',
    price: 270, change: 0, changePct: 0,
    volume: 0, marketCap: 49_963_705_790,
    high52w: 335, low52w: 225, lastUpdated: '2026-05-17',
    history: seedHistory(270, 90, 0.015),
  },
  // ── Industrial / Gases ─────────────────────────────────────────────────
  {
    id: 'tol', symbol: 'TOL', name: 'TOL Gases Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Industrial',
    price: 920, change: -20, changePct: -2.17,
    volume: 14200, marketCap: 52_042_896_515,
    high52w: 1210, low52w: 670, lastUpdated: '2026-05-17',
    history: seedHistory(920, 90, 0.025),
  },
  // ── Retail ─────────────────────────────────────────────────────────────
  {
    id: 'usl', symbol: 'USL', name: 'Uchumi Supermarket Limited',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Retail',
    price: 25, change: 0, changePct: 0,
    volume: 0, marketCap: 9_124_139_850,
    high52w: 25, low52w: 5, lastUpdated: '2026-05-17',
    history: seedHistory(25, 90, 0.01),
  },
  // ── Other ──────────────────────────────────────────────────────────────
  {
    id: 'jatu', symbol: 'JATU', name: 'Jatu Plc',
    category: 'stock', source: 'DSE_LIVE', currency: 'TZS', sector: 'Other',
    price: 265, change: 0, changePct: 0,
    volume: 0, marketCap: 5_283_791_805,
    high52w: 265, low52w: 265, lastUpdated: '2026-05-17',
    history: seedHistory(265, 90, 0.01),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GOVERNMENT SECURITIES — BOT bi-weekly auction weighted-average yields, May 2026
// ─────────────────────────────────────────────────────────────────────────────
export const GOVERNMENT_BONDS: Asset[] = [
  { id: 'tbill-91',  symbol: 'T-BILL-91D',  name: '91-Day Treasury Bill',        category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 97_635, change: 0, changePct: 0, volume: 0, yield: 9.65,  maturity: '91 days',   lastUpdated: '2026-05-14', history: seedHistory(97635,  90, 0.0004) },
  { id: 'tbill-182', symbol: 'T-BILL-182D', name: '182-Day Treasury Bill',       category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 95_098, change: 0, changePct: 0, volume: 0, yield: 10.40, maturity: '182 days',  lastUpdated: '2026-05-14', history: seedHistory(95098,  90, 0.0004) },
  { id: 'tbill-364', symbol: 'T-BILL-364D', name: '364-Day Treasury Bill',       category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 90_434, change: 0, changePct: 0, volume: 0, yield: 11.86, maturity: '364 days',  lastUpdated: '2026-05-07', history: seedHistory(90434,  90, 0.0005) },
  { id: 'bond-2y',   symbol: 'GOV-2Y',      name: '2-Year Government Bond',      category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 13.50, maturity: '2 years',   lastUpdated: '2026-04-30', history: seedHistory(100000, 90, 0.001)  },
  { id: 'bond-5y',   symbol: 'GOV-5Y',      name: '5-Year Government Bond',      category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 14.93, maturity: '5 years',   lastUpdated: '2026-04-30', history: seedHistory(100000, 90, 0.002)  },
  { id: 'bond-10y',  symbol: 'GOV-10Y',     name: '10-Year Government Bond',     category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 15.78, maturity: '10 years',  lastUpdated: '2026-03-28', history: seedHistory(100000, 90, 0.003)  },
  { id: 'bond-15y',  symbol: 'GOV-15Y',     name: '15-Year Government Bond',     category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 16.26, maturity: '15 years',  lastUpdated: '2026-03-28', history: seedHistory(100000, 90, 0.003)  },
  { id: 'bond-20y',  symbol: 'GOV-20Y',     name: '20-Year Government Bond',     category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 16.50, maturity: '20 years',  lastUpdated: '2026-03-28', history: seedHistory(100000, 90, 0.004)  },
  { id: 'bond-25y',  symbol: 'GOV-25Y',     name: '25-Year Government Bond',     category: 'bond', source: 'BOT_REF', currency: 'TZS', price: 100_000, change: 0, changePct: 0, volume: 0, yield: 16.98, maturity: '25 years',  lastUpdated: '2026-03-28', history: seedHistory(100000, 90, 0.004)  },
];

// ─────────────────────────────────────────────────────────────────────────────
// UTT AMIS FUNDS — published NAVs, May 2026
// ─────────────────────────────────────────────────────────────────────────────
export const UNIT_TRUST_FUNDS: Asset[] = [
  { id: 'umoja',  symbol: 'UMOJA',  name: 'UTT AMIS Umoja Fund',                 category: 'fund', source: 'UTT_NAV', currency: 'TZS', price: 1248.62, change: 8.40,  changePct: 0.68,  volume: 0, nav: 1248.62, yield: 12.4, lastUpdated: '2026-05-16', history: seedHistory(1248.62, 90, 0.007) },
  { id: 'jikimu', symbol: 'JIKIMU', name: 'UTT AMIS Jikimu Fund',                category: 'fund', source: 'UTT_NAV', currency: 'TZS', price: 513.45,  change: 2.10,  changePct: 0.41,  volume: 0, nav: 513.45,  yield: 10.8, lastUpdated: '2026-05-16', history: seedHistory(513.45,  90, 0.006) },
  { id: 'liquid', symbol: 'LIQUID', name: 'UTT AMIS Liquid Fund',                category: 'fund', source: 'UTT_NAV', currency: 'TZS', price: 1008.92, change: 1.20,  changePct: 0.12,  volume: 0, nav: 1008.92, yield: 9.2,  lastUpdated: '2026-05-16', history: seedHistory(1008.92, 90, 0.002) },
  { id: 'watoto', symbol: 'WATOTO', name: 'Watoto Fund (UTT AMIS)',               category: 'fund', source: 'UTT_NAV', currency: 'TZS', price: 348.17,  change: -1.40, changePct: -0.40, volume: 0, nav: 348.17,  yield: 11.5, lastUpdated: '2026-05-16', history: seedHistory(348.17,  90, 0.009) },
  { id: 'wekeza', symbol: 'WEKEZA', name: 'Wekeza Maisha Fund',                  category: 'fund', source: 'UTT_NAV', currency: 'TZS', price: 1897.34, change: 15.80, changePct: 0.84,  volume: 0, nav: 1897.34, yield: 13.2, lastUpdated: '2026-05-16', history: seedHistory(1897.34, 90, 0.009) },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOREX — seed values; dashboard replaces with live ExchangeRate-API data
// ─────────────────────────────────────────────────────────────────────────────
export const FOREX_RATES: Asset[] = [
  { id: 'tzs-usd', symbol: 'TZS/USD', name: 'Tanzania Shilling / US Dollar',      category: 'forex', source: 'LIVE', currency: 'TZS', price: 2604.51, change: 0, changePct: 0, volume: 0, lastUpdated: '', history: seedHistory(2604.51, 90, 0.004) },
  { id: 'tzs-eur', symbol: 'TZS/EUR', name: 'Tanzania Shilling / Euro',            category: 'forex', source: 'LIVE', currency: 'TZS', price: 2874.10, change: 0, changePct: 0, volume: 0, lastUpdated: '', history: seedHistory(2874.10, 90, 0.005) },
  { id: 'tzs-gbp', symbol: 'TZS/GBP', name: 'Tanzania Shilling / British Pound',  category: 'forex', source: 'LIVE', currency: 'TZS', price: 3344.20, change: 0, changePct: 0, volume: 0, lastUpdated: '', history: seedHistory(3344.20, 90, 0.005) },
  { id: 'tzs-kes', symbol: 'TZS/KES', name: 'Tanzania Shilling / Kenya Shilling', category: 'forex', source: 'LIVE', currency: 'TZS', price: 20.15,   change: 0, changePct: 0, volume: 0, lastUpdated: '', history: seedHistory(20.15,   90, 0.003) },
];

export const ALL_ASSETS = [...DSE_STOCKS, ...GOVERNMENT_BONDS, ...UNIT_TRUST_FUNDS, ...FOREX_RATES];

export function formatTZS(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000_000) return `TZS ${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000)     return `TZS ${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000)         return `TZS ${(value / 1_000_000).toFixed(2)}M`;
  }
  return `TZS ${value.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const DATA_SOURCE_LABELS: Record<DataSource, { label: string; color: string; url: string }> = {
  DSE_LIVE: { label: '● DSE LIVE', color: '#00ff88', url: 'https://dse.co.tz/market/data/overview' },
  BOT_REF:  { label: 'BOT REF',   color: '#ffaa00', url: 'https://www.bot.go.tz'                  },
  UTT_NAV:  { label: 'UTT NAV',   color: '#aa88ff', url: 'https://www.utt-amis.co.tz'             },
  LIVE:     { label: '● LIVE',    color: '#00ff88', url: 'https://exchangerate-api.com'            },
};

export const SECTOR_COLORS: Record<string, string> = {
  Banking:           '#00ff88',
  'Consumer Goods':  '#00ccff',
  Materials:         '#ffaa00',
  Transportation:    '#ff6688',
  Agriculture:       '#88ff44',
  Insurance:         '#aa88ff',
  'Financial Services': '#ff9900',
  Telecoms:          '#ff55cc',
  Energy:            '#ffdd00',
  Media:             '#55aaff',
  Industrial:        '#aaaaaa',
  Retail:            '#ff8866',
  Other:             '#666666',
};
