// ─────────────────────────────────────────────────────────────────────────────
// Investment Management Data — AssetConnect IMS for Tanzania
// Mutual Funds | Pension Funds | Provident Funds | Private Equity
// ─────────────────────────────────────────────────────────────────────────────

export type FundType     = 'mutual' | 'pension' | 'provident' | 'private_equity';
export type RiskProfile  = 'money_market' | 'conservative' | 'balanced' | 'aggressive';
export type FundStatus   = 'active' | 'suspended' | 'winding_down';
export type HolderType   = 'individual' | 'joint' | 'corporate';
export type KYCStatus    = 'verified' | 'pending' | 'expired';
export type TxnType      = 'purchase' | 'redemption' | 'transfer_in' | 'transfer_out' | 'dividend' | 'bonus';

export interface FundAllocation {
  asset: string;
  pct:   number;
  color: string;
}

export interface NavPoint {
  date: string;
  nav:  number;
}

export interface Fund {
  id:                string;
  name:              string;
  shortName:         string;
  type:              FundType;
  nav:               number;
  prevNav:           number;
  aum:               number;   // TZS
  unitsOutstanding:  number;
  inceptionDate:     string;
  managementFee:     number;   // % p.a.
  riskProfile:       RiskProfile;
  benchmark:         string;
  ytdReturn:         number;
  oneYrReturn:       number;
  threeYrReturn:     number;
  allocation:        FundAllocation[];
  navHistory:        NavPoint[];
  status:            FundStatus;
  fundManager:       string;
  trustee:           string;
  minInvestment:     number;
  unitHolders:       number;
  currency:          'TZS';
}

export interface UnitHolder {
  id:              string;
  accountNo:       string;
  name:            string;
  type:            HolderType;
  fundId:          string;
  units:           number;
  investedAmount:  number;
  currentValue:    number;
  gainLoss:        number;
  gainLossPct:     number;
  kyc:             KYCStatus;
  joinDate:        string;
  lastTxnDate:     string;
  status:          'active' | 'inactive' | 'frozen';
}

export interface FundTransaction {
  id:          string;
  holderId:    string;
  holderName:  string;
  fundId:      string;
  type:        TxnType;
  date:        string;
  units:       number;
  nav:         number;
  amount:      number;
  fee:         number;
  netAmount:   number;
  status:      'processed' | 'pending' | 'reversed';
}

// ── NAV history generator (deterministic seeded walk) ────────────────────────
function navHistory(base: number, days: number, vol: number, drift: number): NavPoint[] {
  const pts: NavPoint[] = [];
  let v = base;
  // simple deterministic series using sin-based pseudo-noise
  for (let i = days; i >= 0; i--) {
    const d = new Date('2026-06-22');
    d.setDate(d.getDate() - i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const noise = Math.sin(i * 1.7 + base) * vol + Math.cos(i * 0.9 + base * 0.3) * vol * 0.5;
    v = v * (1 + drift + noise);
    pts.push({ date: d.toISOString().split('T')[0], nav: Math.round(v * 100) / 100 });
  }
  return pts;
}

// ── MUTUAL FUNDS ─────────────────────────────────────────────────────────────

const UMOJA_HIST      = navHistory(2460, 90, 0.003, 0.0008);
const WEKEZA_HIST     = navHistory(1380, 90, 0.002, 0.0007);
const LIQUID_HIST     = navHistory(985,  90, 0.0003, 0.0003);
const BOND_HIST       = navHistory(1070, 90, 0.001, 0.0005);

export const MUTUAL_FUNDS: Fund[] = [
  {
    id: 'umoja',
    name: 'UTT AMIS Umoja Fund',
    shortName: 'UMOJA',
    type: 'mutual',
    nav: UMOJA_HIST[UMOJA_HIST.length - 1].nav,
    prevNav: UMOJA_HIST[UMOJA_HIST.length - 2]?.nav ?? 2460,
    aum: 254_800_000_000,
    unitsOutstanding: 103_600_000,
    inceptionDate: '2005-03-15',
    managementFee: 2.5,
    riskProfile: 'aggressive',
    benchmark: 'DSE All Share Index',
    ytdReturn: 8.43,
    oneYrReturn: 14.72,
    threeYrReturn: 38.4,
    allocation: [
      { asset: 'DSE Equities', pct: 72, color: '#0e8a4f' },
      { asset: 'Treasury Bills', pct: 15, color: '#e10600' },
      { asset: 'Corporate Bonds', pct: 8, color: '#ffaa00' },
      { asset: 'Cash & MM', pct: 5, color: '#888' },
    ],
    navHistory: UMOJA_HIST,
    status: 'active',
    fundManager: 'UTT Asset Management',
    trustee: 'Standard Chartered Bank TZ',
    minInvestment: 10_000,
    unitHolders: 48_720,
    currency: 'TZS',
  },
  {
    id: 'wekeza',
    name: 'UTT AMIS Wekeza Maisha',
    shortName: 'WEKEZA',
    type: 'mutual',
    nav: WEKEZA_HIST[WEKEZA_HIST.length - 1].nav,
    prevNav: WEKEZA_HIST[WEKEZA_HIST.length - 2]?.nav ?? 1380,
    aum: 181_300_000_000,
    unitsOutstanding: 131_400_000,
    inceptionDate: '2009-06-01',
    managementFee: 2.0,
    riskProfile: 'balanced',
    benchmark: '50% DSE Index / 50% 182-Day T-Bill',
    ytdReturn: 6.18,
    oneYrReturn: 10.34,
    threeYrReturn: 28.9,
    allocation: [
      { asset: 'DSE Equities', pct: 48, color: '#0e8a4f' },
      { asset: 'Government Bonds', pct: 30, color: '#e10600' },
      { asset: 'Treasury Bills', pct: 14, color: '#ffaa00' },
      { asset: 'Cash & MM', pct: 8, color: '#888' },
    ],
    navHistory: WEKEZA_HIST,
    status: 'active',
    fundManager: 'UTT Asset Management',
    trustee: 'Standard Chartered Bank TZ',
    minInvestment: 10_000,
    unitHolders: 62_490,
    currency: 'TZS',
  },
  {
    id: 'liquid',
    name: 'UTT AMIS Liquid Fund',
    shortName: 'LIQUID',
    type: 'mutual',
    nav: LIQUID_HIST[LIQUID_HIST.length - 1].nav,
    prevNav: LIQUID_HIST[LIQUID_HIST.length - 2]?.nav ?? 985,
    aum: 122_600_000_000,
    unitsOutstanding: 124_200_000,
    inceptionDate: '2012-01-10',
    managementFee: 1.25,
    riskProfile: 'money_market',
    benchmark: '91-Day T-Bill Rate',
    ytdReturn: 4.82,
    oneYrReturn: 9.65,
    threeYrReturn: 22.1,
    allocation: [
      { asset: 'Treasury Bills', pct: 65, color: '#e10600' },
      { asset: 'Bank Deposits', pct: 20, color: '#0e8a4f' },
      { asset: 'Commercial Paper', pct: 10, color: '#ffaa00' },
      { asset: 'Cash', pct: 5, color: '#888' },
    ],
    navHistory: LIQUID_HIST,
    status: 'active',
    fundManager: 'UTT Asset Management',
    trustee: 'Standard Chartered Bank TZ',
    minInvestment: 5_000,
    unitHolders: 93_150,
    currency: 'TZS',
  },
  {
    id: 'bond',
    name: 'UTT AMIS Bond Fund',
    shortName: 'BOND',
    type: 'mutual',
    nav: BOND_HIST[BOND_HIST.length - 1].nav,
    prevNav: BOND_HIST[BOND_HIST.length - 2]?.nav ?? 1070,
    aum: 78_400_000_000,
    unitsOutstanding: 73_300_000,
    inceptionDate: '2014-09-22',
    managementFee: 1.5,
    riskProfile: 'conservative',
    benchmark: 'BOT 5-Year Bond Yield',
    ytdReturn: 5.64,
    oneYrReturn: 11.28,
    threeYrReturn: 30.5,
    allocation: [
      { asset: 'Government Bonds', pct: 70, color: '#e10600' },
      { asset: 'Corporate Bonds', pct: 15, color: '#ffaa00' },
      { asset: 'Treasury Bills', pct: 10, color: '#0e8a4f' },
      { asset: 'Cash', pct: 5, color: '#888' },
    ],
    navHistory: BOND_HIST,
    status: 'active',
    fundManager: 'UTT Asset Management',
    trustee: 'Standard Chartered Bank TZ',
    minInvestment: 10_000,
    unitHolders: 29_840,
    currency: 'TZS',
  },
];

// ── PENSION FUNDS ─────────────────────────────────────────────────────────────

const PEN_A = navHistory(1820, 90, 0.0015, 0.0005);
const PEN_B = navHistory(2240, 90, 0.002,  0.0007);
const PEN_C = navHistory(3100, 90, 0.003,  0.001);

export const PENSION_FUNDS: Fund[] = [
  {
    id: 'gepf-a',
    name: 'GEPF Tanzania — Scheme A (Conservative)',
    shortName: 'GEPF-A',
    type: 'pension',
    nav: PEN_A[PEN_A.length - 1].nav,
    prevNav: PEN_A[PEN_A.length - 2]?.nav ?? 1820,
    aum: 312_000_000_000,
    unitsOutstanding: 171_400_000,
    inceptionDate: '2001-07-01',
    managementFee: 1.0,
    riskProfile: 'conservative',
    benchmark: '182-Day T-Bill + 2%',
    ytdReturn: 5.20,
    oneYrReturn: 10.48,
    threeYrReturn: 26.3,
    allocation: [
      { asset: 'Government Bonds', pct: 55, color: '#e10600' },
      { asset: 'Treasury Bills', pct: 25, color: '#0e8a4f' },
      { asset: 'DSE Equities', pct: 12, color: '#ffaa00' },
      { asset: 'Cash & MM', pct: 8, color: '#888' },
    ],
    navHistory: PEN_A,
    status: 'active',
    fundManager: 'GEPF Fund Managers Ltd',
    trustee: 'CRDB Bank PLC',
    minInvestment: 0,
    unitHolders: 18_420,
    currency: 'TZS',
  },
  {
    id: 'gepf-b',
    name: 'GEPF Tanzania — Scheme B (Balanced)',
    shortName: 'GEPF-B',
    type: 'pension',
    nav: PEN_B[PEN_B.length - 1].nav,
    prevNav: PEN_B[PEN_B.length - 2]?.nav ?? 2240,
    aum: 418_500_000_000,
    unitsOutstanding: 186_800_000,
    inceptionDate: '2001-07-01',
    managementFee: 1.25,
    riskProfile: 'balanced',
    benchmark: '60% DSE Index / 40% Bond Index',
    ytdReturn: 7.84,
    oneYrReturn: 13.26,
    threeYrReturn: 34.7,
    allocation: [
      { asset: 'DSE Equities', pct: 40, color: '#0e8a4f' },
      { asset: 'Government Bonds', pct: 35, color: '#e10600' },
      { asset: 'Real Estate', pct: 15, color: '#ffaa00' },
      { asset: 'Cash & MM', pct: 10, color: '#888' },
    ],
    navHistory: PEN_B,
    status: 'active',
    fundManager: 'GEPF Fund Managers Ltd',
    trustee: 'CRDB Bank PLC',
    minInvestment: 0,
    unitHolders: 24_180,
    currency: 'TZS',
  },
  {
    id: 'gepf-c',
    name: 'GEPF Tanzania — Scheme C (Growth)',
    shortName: 'GEPF-C',
    type: 'pension',
    nav: PEN_C[PEN_C.length - 1].nav,
    prevNav: PEN_C[PEN_C.length - 2]?.nav ?? 3100,
    aum: 89_200_000_000,
    unitsOutstanding: 28_800_000,
    inceptionDate: '2003-01-15',
    managementFee: 1.75,
    riskProfile: 'aggressive',
    benchmark: 'DSE All Share Index + 3%',
    ytdReturn: 11.42,
    oneYrReturn: 18.94,
    threeYrReturn: 52.8,
    allocation: [
      { asset: 'DSE Equities', pct: 65, color: '#0e8a4f' },
      { asset: 'Private Equity', pct: 20, color: '#b45309' },
      { asset: 'Government Bonds', pct: 10, color: '#e10600' },
      { asset: 'Cash', pct: 5, color: '#888' },
    ],
    navHistory: PEN_C,
    status: 'active',
    fundManager: 'GEPF Fund Managers Ltd',
    trustee: 'CRDB Bank PLC',
    minInvestment: 0,
    unitHolders: 5_840,
    currency: 'TZS',
  },
];

// ── PROVIDENT FUNDS ───────────────────────────────────────────────────────────

const CRDB_PF = navHistory(1480, 90, 0.0012, 0.0004);
const NMB_PF  = navHistory(1350, 90, 0.0011, 0.0004);
const TBL_PF  = navHistory(1620, 90, 0.0014, 0.0005);

export const PROVIDENT_FUNDS: Fund[] = [
  {
    id: 'crdb-pf',
    name: 'CRDB Bank Staff Provident Fund',
    shortName: 'CRDB-PF',
    type: 'provident',
    nav: CRDB_PF[CRDB_PF.length - 1].nav,
    prevNav: CRDB_PF[CRDB_PF.length - 2]?.nav ?? 1480,
    aum: 15_400_000_000,
    unitsOutstanding: 10_400_000,
    inceptionDate: '1997-04-01',
    managementFee: 0.75,
    riskProfile: 'conservative',
    benchmark: '91-Day T-Bill Rate',
    ytdReturn: 4.48,
    oneYrReturn: 9.20,
    threeYrReturn: 23.1,
    allocation: [
      { asset: 'Treasury Bills', pct: 50, color: '#e10600' },
      { asset: 'DSE Equities', pct: 25, color: '#0e8a4f' },
      { asset: 'Term Deposits', pct: 20, color: '#ffaa00' },
      { asset: 'Cash', pct: 5, color: '#888' },
    ],
    navHistory: CRDB_PF,
    status: 'active',
    fundManager: 'CRDB Asset Management',
    trustee: 'Standard Chartered Bank TZ',
    minInvestment: 0,
    unitHolders: 4_280,
    currency: 'TZS',
  },
  {
    id: 'nmb-pf',
    name: 'NMB Bank Staff Provident Fund',
    shortName: 'NMB-PF',
    type: 'provident',
    nav: NMB_PF[NMB_PF.length - 1].nav,
    prevNav: NMB_PF[NMB_PF.length - 2]?.nav ?? 1350,
    aum: 12_100_000_000,
    unitsOutstanding: 8_960_000,
    inceptionDate: '2002-02-01',
    managementFee: 0.75,
    riskProfile: 'conservative',
    benchmark: '91-Day T-Bill Rate',
    ytdReturn: 4.22,
    oneYrReturn: 8.86,
    threeYrReturn: 21.4,
    allocation: [
      { asset: 'Treasury Bills', pct: 55, color: '#e10600' },
      { asset: 'DSE Equities', pct: 20, color: '#0e8a4f' },
      { asset: 'Corporate Bonds', pct: 15, color: '#ffaa00' },
      { asset: 'Cash', pct: 10, color: '#888' },
    ],
    navHistory: NMB_PF,
    status: 'active',
    fundManager: 'NMB Capital',
    trustee: 'Stanbic Bank Tanzania',
    minInvestment: 0,
    unitHolders: 3_640,
    currency: 'TZS',
  },
  {
    id: 'tbl-pf',
    name: 'Tanzania Breweries Staff Provident Fund',
    shortName: 'TBL-PF',
    type: 'provident',
    nav: TBL_PF[TBL_PF.length - 1].nav,
    prevNav: TBL_PF[TBL_PF.length - 2]?.nav ?? 1620,
    aum: 8_300_000_000,
    unitsOutstanding: 5_120_000,
    inceptionDate: '1995-09-01',
    managementFee: 0.80,
    riskProfile: 'balanced',
    benchmark: '182-Day T-Bill + 1%',
    ytdReturn: 5.86,
    oneYrReturn: 11.14,
    threeYrReturn: 27.8,
    allocation: [
      { asset: 'Government Bonds', pct: 40, color: '#e10600' },
      { asset: 'DSE Equities', pct: 35, color: '#0e8a4f' },
      { asset: 'Treasury Bills', pct: 15, color: '#ffaa00' },
      { asset: 'Cash', pct: 10, color: '#888' },
    ],
    navHistory: TBL_PF,
    status: 'active',
    fundManager: 'Tanzania Breweries Finance Dept',
    trustee: 'NMB Bank PLC',
    minInvestment: 0,
    unitHolders: 1_820,
    currency: 'TZS',
  },
];

// ── PRIVATE EQUITY ────────────────────────────────────────────────────────────

const EAIF_HIST = navHistory(4800, 90, 0.002, 0.0012);
const TGF_HIST  = navHistory(6200, 90, 0.003, 0.0015);

export const PRIVATE_EQUITY_FUNDS: Fund[] = [
  {
    id: 'ea-infra',
    name: 'East Africa Infrastructure Fund',
    shortName: 'EAIF',
    type: 'private_equity',
    nav: EAIF_HIST[EAIF_HIST.length - 1].nav,
    prevNav: EAIF_HIST[EAIF_HIST.length - 2]?.nav ?? 4800,
    aum: 68_500_000_000,
    unitsOutstanding: 14_270_000,
    inceptionDate: '2016-06-01',
    managementFee: 2.0,
    riskProfile: 'balanced',
    benchmark: 'East Africa Infrastructure Index',
    ytdReturn: 9.84,
    oneYrReturn: 17.20,
    threeYrReturn: 44.6,
    allocation: [
      { asset: 'Energy & Utilities', pct: 40, color: '#ffaa00' },
      { asset: 'Transport & Logistics', pct: 30, color: '#0e8a4f' },
      { asset: 'Telecoms', pct: 20, color: '#e10600' },
      { asset: 'Cash', pct: 10, color: '#888' },
    ],
    navHistory: EAIF_HIST,
    status: 'active',
    fundManager: 'Mkoba Private Equity',
    trustee: 'Stanbic Bank Tanzania',
    minInvestment: 500_000_000,
    unitHolders: 42,
    currency: 'TZS',
  },
  {
    id: 'tz-growth',
    name: 'Tanzania Growth Fund II',
    shortName: 'TGF-II',
    type: 'private_equity',
    nav: TGF_HIST[TGF_HIST.length - 1].nav,
    prevNav: TGF_HIST[TGF_HIST.length - 2]?.nav ?? 6200,
    aum: 44_200_000_000,
    unitsOutstanding: 7_130_000,
    inceptionDate: '2019-03-01',
    managementFee: 2.5,
    riskProfile: 'aggressive',
    benchmark: 'CPI + 10%',
    ytdReturn: 14.36,
    oneYrReturn: 23.48,
    threeYrReturn: 68.2,
    allocation: [
      { asset: 'Agri-business', pct: 35, color: '#0e8a4f' },
      { asset: 'Fintech', pct: 30, color: '#e10600' },
      { asset: 'Healthcare', pct: 25, color: '#ffaa00' },
      { asset: 'Cash', pct: 10, color: '#888' },
    ],
    navHistory: TGF_HIST,
    status: 'active',
    fundManager: 'Novastar Ventures EA',
    trustee: 'CRDB Bank PLC',
    minInvestment: 1_000_000_000,
    unitHolders: 18,
    currency: 'TZS',
  },
];

export const ALL_FUNDS = [...MUTUAL_FUNDS, ...PENSION_FUNDS, ...PROVIDENT_FUNDS, ...PRIVATE_EQUITY_FUNDS];

// ── UNIT HOLDERS ──────────────────────────────────────────────────────────────

export const UNIT_HOLDERS: UnitHolder[] = [
  { id:'h01', accountNo:'UH-2024-0001', name:'Amina Rashid Hassan',    type:'individual', fundId:'umoja',  units:12_450, investedAmount:26_000_000, currentValue:31_200_000, gainLoss:5_200_000, gainLossPct:20.0, kyc:'verified', joinDate:'2020-03-12', lastTxnDate:'2026-05-10', status:'active' },
  { id:'h02', accountNo:'UH-2024-0002', name:'Juma Mohammed Ally',     type:'individual', fundId:'umoja',  units:8_320,  investedAmount:17_500_000, currentValue:20_900_000, gainLoss:3_400_000, gainLossPct:19.4, kyc:'verified', joinDate:'2021-07-08', lastTxnDate:'2026-06-01', status:'active' },
  { id:'h03', accountNo:'UH-2024-0003', name:'Fatuma Kileo & Spouse',  type:'joint',      fundId:'wekeza', units:25_600, investedAmount:35_000_000, currentValue:40_100_000, gainLoss:5_100_000, gainLossPct:14.6, kyc:'verified', joinDate:'2019-11-22', lastTxnDate:'2026-04-15', status:'active' },
  { id:'h04', accountNo:'UH-2024-0004', name:'Coastal Traders Ltd',    type:'corporate',  fundId:'liquid', units:180_000,investedAmount:175_000_000,currentValue:178_200_000,gainLoss:3_200_000, gainLossPct:1.8,  kyc:'verified', joinDate:'2022-01-05', lastTxnDate:'2026-06-20', status:'active' },
  { id:'h05', accountNo:'UH-2024-0005', name:'Peter Emmanuel Mwanga',  type:'individual', fundId:'bond',   units:6_200,  investedAmount:7_000_000,  currentValue:7_400_000,  gainLoss:400_000,   gainLossPct:5.7,  kyc:'pending',  joinDate:'2023-08-14', lastTxnDate:'2026-03-28', status:'active' },
  { id:'h06', accountNo:'UH-2024-0006', name:'Neema Josephat Mushi',   type:'individual', fundId:'umoja',  units:3_900,  investedAmount:8_200_000,  currentValue:9_800_000,  gainLoss:1_600_000, gainLossPct:19.5, kyc:'verified', joinDate:'2021-02-19', lastTxnDate:'2026-05-30', status:'active' },
  { id:'h07', accountNo:'UH-2024-0007', name:'Simba Holdings Ltd',     type:'corporate',  fundId:'wekeza', units:95_000, investedAmount:120_000_000,currentValue:135_800_000,gainLoss:15_800_000,gainLossPct:13.2, kyc:'verified', joinDate:'2018-06-30', lastTxnDate:'2026-06-18', status:'active' },
  { id:'h08', accountNo:'UH-2024-0008', name:'Grace Mtambike',         type:'individual', fundId:'liquid', units:22_100, investedAmount:21_500_000, currentValue:22_000_000, gainLoss:500_000,   gainLossPct:2.3,  kyc:'verified', joinDate:'2022-09-01', lastTxnDate:'2026-06-10', status:'active' },
  { id:'h09', accountNo:'UH-2024-0009', name:'Hamisi Bwana Kopa',      type:'individual', fundId:'bond',   units:4_800,  investedAmount:5_100_000,  currentValue:5_600_000,  gainLoss:500_000,   gainLossPct:9.8,  kyc:'expired',  joinDate:'2020-12-01', lastTxnDate:'2025-11-20', status:'active' },
  { id:'h10', accountNo:'UH-2024-0010', name:'Zanzibar Spice Exports', type:'corporate',  fundId:'umoja',  units:42_000, investedAmount:88_000_000, currentValue:105_400_000,gainLoss:17_400_000,gainLossPct:19.8, kyc:'verified', joinDate:'2017-03-22', lastTxnDate:'2026-06-15', status:'active' },
  { id:'h11', accountNo:'UH-2024-0011', name:'Salma Rashid Omari',     type:'individual', fundId:'wekeza', units:9_600,  investedAmount:13_000_000, currentValue:14_800_000, gainLoss:1_800_000, gainLossPct:13.8, kyc:'verified', joinDate:'2022-04-08', lastTxnDate:'2026-06-08', status:'active' },
  { id:'h12', accountNo:'UH-2024-0012', name:'Kilimanjaro Tea Ltd',    type:'corporate',  fundId:'bond',   units:55_000, investedAmount:60_000_000, currentValue:64_500_000, gainLoss:4_500_000, gainLossPct:7.5,  kyc:'verified', joinDate:'2021-10-14', lastTxnDate:'2026-05-28', status:'active' },
];

// ── FUND TRANSACTIONS ─────────────────────────────────────────────────────────

export const FUND_TRANSACTIONS: FundTransaction[] = [
  { id:'t01', holderId:'h01', holderName:'Amina Rashid Hassan',  fundId:'umoja',  type:'purchase',    date:'2026-06-18', units:2_000,  nav:2_485, amount:4_970_000,  fee:49_700,  netAmount:5_019_700,  status:'processed' },
  { id:'t02', holderId:'h04', holderName:'Coastal Traders Ltd',  fundId:'liquid', type:'purchase',    date:'2026-06-20', units:20_000, nav:992,   amount:19_840_000, fee:0,        netAmount:19_840_000, status:'processed' },
  { id:'t03', holderId:'h07', holderName:'Simba Holdings Ltd',   fundId:'wekeza', type:'redemption',  date:'2026-06-19', units:5_000,  nav:1_418, amount:7_090_000,  fee:35_450,  netAmount:7_054_550,  status:'processed' },
  { id:'t04', holderId:'h10', holderName:'Zanzibar Spice Exp.', fundId:'umoja',  type:'purchase',    date:'2026-06-22', units:3_500,  nav:2_491, amount:8_718_500,  fee:87_185,  netAmount:8_805_685,  status:'pending' },
  { id:'t05', holderId:'h05', holderName:'Peter Emmanuel',       fundId:'bond',   type:'redemption',  date:'2026-06-15', units:800,    nav:1_194, amount:955_200,    fee:4_776,   netAmount:950_424,    status:'processed' },
  { id:'t06', holderId:'h02', holderName:'Juma Mohammed Ally',  fundId:'umoja',  type:'transfer_in', date:'2026-06-10', units:1_200,  nav:2_470, amount:2_964_000,  fee:0,        netAmount:2_964_000,  status:'processed' },
  { id:'t07', holderId:'h11', holderName:'Salma Rashid Omari',  fundId:'wekeza', type:'purchase',    date:'2026-06-22', units:1_500,  nav:1_421, amount:2_131_500,  fee:21_315,  netAmount:2_152_815,  status:'pending' },
  { id:'t08', holderId:'h12', holderName:'Kilimanjaro Tea Ltd', fundId:'bond',   type:'dividend',    date:'2026-06-01', units:0,      nav:0,     amount:1_230_000,  fee:0,        netAmount:1_230_000,  status:'processed' },
];

// ── MEMBER CONTRIBUTION (Provident Fund) ──────────────────────────────────────

export interface MemberContribution {
  memberId:    string;
  memberName:  string;
  fundId:      string;
  employer:    string;
  employerContrib: number;
  employeeContrib: number;
  total:       number;
  month:       string;
  status:      'posted' | 'pending' | 'failed';
}

export const MEMBER_CONTRIBUTIONS: MemberContribution[] = [
  { memberId:'M001', memberName:'Ali Hamisi',      fundId:'crdb-pf', employer:'CRDB Bank', employerContrib:580_000, employeeContrib:290_000, total:870_000,   month:'2026-05', status:'posted' },
  { memberId:'M002', memberName:'Rose Mwangi',     fundId:'crdb-pf', employer:'CRDB Bank', employerContrib:420_000, employeeContrib:210_000, total:630_000,   month:'2026-05', status:'posted' },
  { memberId:'M003', memberName:'David Kimani',    fundId:'nmb-pf',  employer:'NMB Bank',  employerContrib:650_000, employeeContrib:325_000, total:975_000,   month:'2026-05', status:'posted' },
  { memberId:'M004', memberName:'Zuhura Hassan',   fundId:'nmb-pf',  employer:'NMB Bank',  employerContrib:380_000, employeeContrib:190_000, total:570_000,   month:'2026-05', status:'pending' },
  { memberId:'M005', memberName:'Felix Omondi',    fundId:'tbl-pf',  employer:'TBL',       employerContrib:720_000, employeeContrib:360_000, total:1_080_000, month:'2026-05', status:'posted' },
  { memberId:'M006', memberName:'Pendo Mwakagale', fundId:'tbl-pf',  employer:'TBL',       employerContrib:490_000, employeeContrib:245_000, total:735_000,   month:'2026-05', status:'posted' },
];

// ── COMPUTED TOTALS ────────────────────────────────────────────────────────────

export const TOTAL_AUM = ALL_FUNDS.reduce((s, f) => s + f.aum, 0);
export const TOTAL_UNIT_HOLDERS = ALL_FUNDS.reduce((s, f) => s + f.unitHolders, 0);

export function navChange(f: Fund) { return f.nav - f.prevNav; }
export function navChangePct(f: Fund) { return f.prevNav ? ((f.nav - f.prevNav) / f.prevNav) * 100 : 0; }

export const RISK_LABELS: Record<RiskProfile, string> = {
  money_market: 'MONEY MARKET',
  conservative: 'CONSERVATIVE',
  balanced:     'BALANCED',
  aggressive:   'AGGRESSIVE / GROWTH',
};

export const FUND_TYPE_LABELS: Record<FundType, string> = {
  mutual:         'MUTUAL FUND',
  pension:        'PENSION FUND',
  provident:      'PROVIDENT FUND',
  private_equity: 'PRIVATE EQUITY',
};

export const FUND_TYPE_COLORS: Record<FundType, string> = {
  mutual:         '#e10600',
  pension:        '#1f2937',
  provident:      '#b45309',
  private_equity: '#6b7280',
};
