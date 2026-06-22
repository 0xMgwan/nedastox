// ─────────────────────────────────────────────────────────────────────────────
// Broker Back Office Data — FIMCO DSE Operations
// Trade Reconciliation | Contract Notes | Settlement | Corporate Actions
// ─────────────────────────────────────────────────────────────────────────────

export type TradeSide     = 'buy' | 'sell';
export type TradeStatus   = 'pending' | 'matched' | 'settled' | 'failed' | 'break' | 'cancelled';
export type SettleStatus  = 'pending' | 'sent' | 'confirmed' | 'failed' | 'overdue';
export type ActionType    = 'dividend' | 'rights_issue' | 'bonus_share' | 'stock_split' | 'agm';
export type ReportType    = 'daily_trades' | 'client_activity' | 'settlement_summary' | 'regulatory_cmsa' | 'regulatory_dse';

// ── FEE SCHEDULE (DSE Tanzania) ───────────────────────────────────────────────

export interface FeeBreakdown {
  grossValue:    number;
  brokerage:     number;
  brokerageRate: number; // %
  vatOnBrok:     number; // 18%
  dseFee:        number; // 0.01%
  cmsaLevy:      number; // 0.01%
  cdsFee:        number; // 0.005%
  totalCharges:  number;
  netSettlement: number;
}

export function calcFees(grossValue: number, side: TradeSide): FeeBreakdown {
  // DSE Tanzania tiered brokerage
  let brokerageRate = 0.015; // 1.5% up to 5M
  if (grossValue > 50_000_000)     brokerageRate = 0.008;
  else if (grossValue > 5_000_000) brokerageRate = 0.010;

  const brokerage  = grossValue * brokerageRate;
  const vatOnBrok  = brokerage * 0.18;
  const dseFee     = grossValue * 0.0001;
  const cmsaLevy   = grossValue * 0.0001;
  const cdsFee     = grossValue * 0.00005;
  const totalCharges = brokerage + vatOnBrok + dseFee + cmsaLevy + cdsFee;
  const netSettlement = side === 'buy' ? grossValue + totalCharges : grossValue - totalCharges;

  return {
    grossValue,
    brokerage:     Math.round(brokerage),
    brokerageRate: brokerageRate * 100,
    vatOnBrok:     Math.round(vatOnBrok),
    dseFee:        Math.round(dseFee),
    cmsaLevy:      Math.round(cmsaLevy),
    cdsFee:        Math.round(cdsFee),
    totalCharges:  Math.round(totalCharges),
    netSettlement: Math.round(netSettlement),
  };
}

// ── BROKERS ───────────────────────────────────────────────────────────────────

export interface Broker {
  id:   string;
  name: string;
  code: string;
  type: 'dse_member' | 'foreign';
}

export const BROKERS: Broker[] = [
  { id:'br1', name:'FIMCO Securities',       code:'FIMCO', type:'dse_member' },
  { id:'br2', name:'Orbit Securities',       code:'ORBIT', type:'dse_member' },
  { id:'br3', name:'Core Securities',        code:'CORE',  type:'dse_member' },
  { id:'br4', name:'Vertex International',   code:'VRTX',  type:'dse_member' },
  { id:'br5', name:'Rasilimali Limited',      code:'RASIL', type:'dse_member' },
  { id:'br6', name:'Standard Securities',    code:'STDSC', type:'dse_member' },
];

// ── TRADES ────────────────────────────────────────────────────────────────────

export interface Trade {
  id:              string;
  contractNo:      string;
  tradeDate:       string;
  settlementDate:  string; // T+2
  symbol:          string;
  companyName:     string;
  side:            TradeSide;
  quantity:        number;
  price:           number;
  grossValue:      number;
  fees:            FeeBreakdown;
  status:          TradeStatus;
  brokerId:        string;
  brokerCode:      string;
  fundId:          string;
  clientName:      string;
  csdRef:          string | null;
  dseRef:          string | null;
  reconciled:      boolean;
  breakReason:     string | null;
}

function mkTrade(
  id: string, no: string, date: string, settle: string,
  sym: string, co: string, side: TradeSide, qty: number, price: number,
  status: TradeStatus, brokerId: string, code: string, fundId: string, client: string,
  csd: string | null, dse: string | null, breakR: string | null
): Trade {
  const gross = qty * price;
  return {
    id, contractNo: no, tradeDate: date, settlementDate: settle,
    symbol: sym, companyName: co, side, quantity: qty, price, grossValue: gross,
    fees: calcFees(gross, side),
    status, brokerId, brokerCode: code, fundId, clientName: client,
    csdRef: csd, dseRef: dse,
    reconciled: status === 'matched' || status === 'settled',
    breakReason: breakR,
  };
}

export const TRADES: Trade[] = [
  mkTrade('tr01','CN-2026-0841','2026-06-20','2026-06-24','CRDB','CRDB Bank Public Ltd','buy', 150_000,2_710,'settled','br1','FIMCO','umoja','UTT AMIS Umoja Fund','CSD-2026-9412','DSE-2026-3841',null),
  mkTrade('tr02','CN-2026-0842','2026-06-20','2026-06-24','NMB', 'NMB Bank PLC',        'sell',20_000, 13_150,'settled','br1','FIMCO','gepf-b','GEPF-B Balanced Scheme','CSD-2026-9413','DSE-2026-3842',null),
  mkTrade('tr03','CN-2026-0843','2026-06-20','2026-06-24','TBL', 'Tanzania Breweries',  'buy', 8_000,  10_410,'matched','br2','ORBIT','wekeza','Wekeza Maisha Fund','CSD-2026-9414','DSE-2026-3843',null),
  mkTrade('tr04','CN-2026-0844','2026-06-21','2026-06-25','KCB', 'KCB Group Tanzania',  'buy', 45_000, 1_770,'matched','br1','FIMCO','umoja','UTT AMIS Umoja Fund','CSD-2026-9421',null,null),
  mkTrade('tr05','CN-2026-0845','2026-06-21','2026-06-25','TCC', 'Tanzania Cigarette Co','sell',3_000,  12_830,'matched','br3','CORE','gepf-b','GEPF-B Balanced Scheme','CSD-2026-9422','DSE-2026-3851',null),
  mkTrade('tr06','CN-2026-0846','2026-06-21','2026-06-25','TPCC','Tanga Portland Cement','buy', 12_000, 7_310,'break','br4','VRTX','crdb-pf','CRDB Staff PF',null,null,'QUANTITY MISMATCH: Broker=12000 CSD=11500'),
  mkTrade('tr07','CN-2026-0847','2026-06-22','2026-06-26','VODA','Vodacom Tanzania',    'buy', 80_000, 765,'pending','br1','FIMCO','liquid','UTT Liquid Fund',null,null,null),
  mkTrade('tr08','CN-2026-0848','2026-06-22','2026-06-26','DCB', 'DCB Commercial Bank', 'sell',25_000, 595,'pending','br2','ORBIT','nmb-pf','NMB Staff PF',null,null,null),
  mkTrade('tr09','CN-2026-0849','2026-06-22','2026-06-26','DSE', 'Dar es Salaam Stock Exchange','buy',5_000,6_310,'pending','br1','FIMCO','ea-infra','EAIF',null,null,null),
  mkTrade('tr10','CN-2026-0850','2026-06-19','2026-06-23','SWIS','Swissport Tanzania',  'sell',10_000, 2_740,'settled','br5','RASIL','tbl-pf','TBL Staff PF','CSD-2026-9380','DSE-2026-3830',null),
  mkTrade('tr11','CN-2026-0835','2026-06-18','2026-06-22','MCB', 'Mkombozi Commercial Bank','buy',30_000,1_310,'settled','br1','FIMCO','gepf-a','GEPF-A Conservative','CSD-2026-9370','DSE-2026-3820',null),
  mkTrade('tr12','CN-2026-0836','2026-06-18','2026-06-22','MKCB','Maendeleo Bank',      'sell',8_000,  4_460,'failed','br6','STDSC','bond','UTT Bond Fund',null,'DSE-2026-3821','CLIENT INSUFFICIENT FUNDS'),
];

// ── SETTLEMENT QUEUE ──────────────────────────────────────────────────────────

export interface SettlementInstruction {
  tradeId:        string;
  contractNo:     string;
  symbol:         string;
  side:           TradeSide;
  quantity:       number;
  settlementDate: string;
  netSettlement:  number;
  dvp:            boolean;
  status:         SettleStatus;
  csdStatus:      'pending' | 'confirmed' | 'rejected' | null;
  fundId:         string;
  fundName:       string;
}

export const SETTLEMENT_QUEUE: SettlementInstruction[] = TRADES
  .filter(t => t.status !== 'cancelled')
  .map(t => ({
    tradeId:        t.id,
    contractNo:     t.contractNo,
    symbol:         t.symbol,
    side:           t.side,
    quantity:       t.quantity,
    settlementDate: t.settlementDate,
    netSettlement:  t.fees.netSettlement,
    dvp:            true,
    status:         t.status === 'settled' ? 'confirmed' :
                    t.status === 'failed'  ? 'failed' :
                    t.status === 'break'   ? 'failed' :
                    t.status === 'matched' ? 'sent' : 'pending',
    csdStatus:      t.status === 'settled' ? 'confirmed' :
                    t.status === 'failed'  ? 'rejected' : null,
    fundId:         t.fundId,
    fundName:       t.clientName,
  } as SettlementInstruction));

// ── CORPORATE ACTIONS ─────────────────────────────────────────────────────────

export interface CorporateAction {
  id:            string;
  symbol:        string;
  companyName:   string;
  type:          ActionType;
  announcedDate: string;
  exDate:        string;
  payDate:       string;
  details:       string;
  amount:        number | null; // TZS per share for dividend
  ratio:         string | null; // for rights/bonus
  status:        'upcoming' | 'ex_date_passed' | 'paid' | 'processing';
}

export const CORPORATE_ACTIONS: CorporateAction[] = [
  {
    id:'ca01', symbol:'CRDB', companyName:'CRDB Bank Public Ltd',
    type:'dividend', announcedDate:'2026-05-28', exDate:'2026-06-25', payDate:'2026-07-10',
    details:'Final dividend of TZS 135 per share for FY 2025',
    amount:135, ratio:null, status:'upcoming',
  },
  {
    id:'ca02', symbol:'NMB', companyName:'NMB Bank PLC',
    type:'dividend', announcedDate:'2026-05-20', exDate:'2026-06-20', payDate:'2026-07-05',
    details:'Interim dividend of TZS 580 per share',
    amount:580, ratio:null, status:'ex_date_passed',
  },
  {
    id:'ca03', symbol:'TBL', companyName:'Tanzania Breweries Ltd',
    type:'rights_issue', announcedDate:'2026-06-01', exDate:'2026-07-01', payDate:'2026-07-30',
    details:'Rights issue 1:5 at TZS 8,500 per new share',
    amount:8_500, ratio:'1:5', status:'upcoming',
  },
  {
    id:'ca04', symbol:'TCC', companyName:'Tanzania Cigarette Co',
    type:'dividend', announcedDate:'2026-04-15', exDate:'2026-05-15', payDate:'2026-06-01',
    details:'Final dividend of TZS 620 per share for FY 2025',
    amount:620, ratio:null, status:'paid',
  },
  {
    id:'ca05', symbol:'KCB', companyName:'KCB Group Tanzania',
    type:'agm', announcedDate:'2026-06-10', exDate:'2026-07-15', payDate:'2026-07-15',
    details:'Annual General Meeting — approval of FY2025 accounts',
    amount:null, ratio:null, status:'upcoming',
  },
  {
    id:'ca06', symbol:'TPCC', companyName:'Tanga Portland Cement',
    type:'bonus_share', announcedDate:'2026-03-01', exDate:'2026-04-01', payDate:'2026-04-15',
    details:'Bonus share issue 1:10 to existing shareholders',
    amount:null, ratio:'1:10', status:'paid',
  },
];

// ── AUDIT LOG ─────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id:        string;
  timestamp: string;
  user:      string;
  role:      string;
  action:    string;
  module:    string;
  details:   string;
  ipAddr:    string;
  status:    'success' | 'failed' | 'warning';
}

export const AUDIT_LOG: AuditEntry[] = [
  { id:'a01', timestamp:'2026-06-22T08:02:14Z', user:'ops.admin',      role:'Operations',     action:'TRADE_ENTERED',       module:'Trade Blotter',       details:'Buy 80,000 VODA @ 765 — Fund: UTT Liquid',          ipAddr:'10.0.1.14', status:'success' },
  { id:'a02', timestamp:'2026-06-22T07:58:32Z', user:'portfolio.mgr',  role:'Portfolio Mgr',  action:'FUND_NAV_APPROVED',   module:'NAV Calculation',     details:'Approved UMOJA NAV: 2,491.20 TZS (prev 2,487.60)',   ipAddr:'10.0.1.22', status:'success' },
  { id:'a03', timestamp:'2026-06-22T07:45:01Z', user:'settlement.clk', role:'Settlement',     action:'SETTLEMENT_SENT',     module:'Settlement',          details:'Settlement instruction sent: CN-2026-0847',          ipAddr:'10.0.1.31', status:'success' },
  { id:'a04', timestamp:'2026-06-21T16:30:45Z', user:'compliance.off', role:'Compliance',     action:'REPORT_GENERATED',    module:'Regulatory Reporting', details:'Daily CMSA report generated and submitted',           ipAddr:'10.0.1.18', status:'success' },
  { id:'a05', timestamp:'2026-06-21T15:22:18Z', user:'ops.admin',      role:'Operations',     action:'TRADE_BREAK_FLAGGED', module:'Reconciliation',      details:'Break identified: CN-2026-0846 qty mismatch',        ipAddr:'10.0.1.14', status:'warning' },
  { id:'a06', timestamp:'2026-06-21T14:10:55Z', user:'transfer.agent', role:'Transfer Agent', action:'KYC_UPDATED',         module:'Unit Holders',        details:'KYC status updated: Peter Emmanuel Mwanga → verified',ipAddr:'10.0.1.40', status:'success' },
  { id:'a07', timestamp:'2026-06-21T13:48:22Z', user:'portfolio.mgr',  role:'Portfolio Mgr',  action:'ALLOC_CHANGED',       module:'Fund Allocation',     details:'GEPF-B equity alloc changed 38%→40%',                ipAddr:'10.0.1.22', status:'success' },
  { id:'a08', timestamp:'2026-06-21T11:05:38Z', user:'ops.admin2',     role:'Operations',     action:'CONTRACT_NOTE_ISSUED',module:'Contract Notes',      details:'Contract note issued: CN-2026-0846 to FIMCO VRTX',   ipAddr:'10.0.1.15', status:'success' },
  { id:'a09', timestamp:'2026-06-21T10:30:00Z', user:'admin.super',    role:'Sysadmin',       action:'USER_LOGIN',          module:'System',              details:'Superuser login from 10.0.1.99',                     ipAddr:'10.0.1.99', status:'warning' },
  { id:'a10', timestamp:'2026-06-20T17:01:44Z', user:'settlement.clk', role:'Settlement',     action:'SETTLEMENT_CONFIRMED',module:'Settlement',          details:'CSD confirmed: CN-2026-0841 CRDB 150k shares',       ipAddr:'10.0.1.31', status:'success' },
  { id:'a11', timestamp:'2026-06-20T16:48:12Z', user:'settlement.clk', role:'Settlement',     action:'SETTLEMENT_CONFIRMED',module:'Settlement',          details:'CSD confirmed: CN-2026-0842 NMB 20k shares',         ipAddr:'10.0.1.31', status:'success' },
  { id:'a12', timestamp:'2026-06-20T15:20:33Z', user:'compliance.off', role:'Compliance',     action:'LIMIT_BREACH_ALERT',  module:'Compliance',          details:'CMSA limit check: UMOJA equity alloc 72% (limit 75%)',ipAddr:'10.0.1.18', status:'warning' },
  { id:'a13', timestamp:'2026-06-20T09:15:00Z', user:'ops.admin',      role:'Operations',     action:'MARKET_OPEN',         module:'System',              details:'DSE market open — live prices connected',             ipAddr:'10.0.1.14', status:'success' },
  { id:'a14', timestamp:'2026-06-19T17:15:00Z', user:'ops.admin',      role:'Operations',     action:'MARKET_CLOSE',        module:'System',              details:'DSE market closed — EOD processing initiated',       ipAddr:'10.0.1.14', status:'success' },
  { id:'a15', timestamp:'2026-06-18T12:30:55Z', user:'transfer.agent', role:'Transfer Agent', action:'REDEMPTION_PROCESSED',module:'Unit Holders',        details:'Redemption: Simba Holdings 5,000 units WEKEZA',      ipAddr:'10.0.1.40', status:'success' },
];

// ── REGULATORY REPORTS ────────────────────────────────────────────────────────

export interface RegulatoryReport {
  id:         string;
  type:       ReportType;
  title:      string;
  period:     string;
  generatedAt:string;
  submittedTo:string;
  status:     'draft' | 'submitted' | 'acknowledged' | 'overdue';
  records:    number;
}

export const REGULATORY_REPORTS: RegulatoryReport[] = [
  { id:'rr01', type:'daily_trades',       title:'Daily Trade Report',          period:'2026-06-22', generatedAt:'2026-06-22T17:05:00Z', submittedTo:'DSE',  status:'draft',        records:6  },
  { id:'rr02', type:'regulatory_cmsa',    title:'CMSA Quarterly Return',       period:'Q2 2026',    generatedAt:'2026-06-22T09:00:00Z', submittedTo:'CMSA', status:'draft',        records:1  },
  { id:'rr03', type:'daily_trades',       title:'Daily Trade Report',          period:'2026-06-21', generatedAt:'2026-06-21T17:03:00Z', submittedTo:'DSE',  status:'submitted',    records:5  },
  { id:'rr04', type:'settlement_summary', title:'Settlement Summary',          period:'2026-06-21', generatedAt:'2026-06-21T17:10:00Z', submittedTo:'CSD',  status:'acknowledged', records:5  },
  { id:'rr05', type:'client_activity',    title:'Client Activity Report',      period:'2026-06-21', generatedAt:'2026-06-21T17:15:00Z', submittedTo:'CMSA', status:'submitted',    records:12 },
  { id:'rr06', type:'regulatory_dse',     title:'DSE Member Report',           period:'May 2026',   generatedAt:'2026-06-05T09:00:00Z', submittedTo:'DSE',  status:'acknowledged', records:48 },
  { id:'rr07', type:'regulatory_cmsa',    title:'CMSA Monthly Return',         period:'May 2026',   generatedAt:'2026-06-05T10:30:00Z', submittedTo:'CMSA', status:'acknowledged', records:1  },
  { id:'rr08', type:'settlement_summary', title:'Settlement Summary',          period:'2026-06-20', generatedAt:'2026-06-20T17:08:00Z', submittedTo:'CSD',  status:'acknowledged', records:4  },
];

// ── SUMMARY STATS ─────────────────────────────────────────────────────────────

export function tradeStats() {
  const settled  = TRADES.filter(t => t.status === 'settled').length;
  const matched  = TRADES.filter(t => t.status === 'matched').length;
  const pending  = TRADES.filter(t => t.status === 'pending').length;
  const breaks   = TRADES.filter(t => t.status === 'break').length;
  const failed   = TRADES.filter(t => t.status === 'failed').length;
  const totalGross = TRADES.reduce((s, t) => s + t.grossValue, 0);
  const totalFees  = TRADES.reduce((s, t) => s + t.fees.totalCharges, 0);
  return { settled, matched, pending, breaks, failed, total: TRADES.length, totalGross, totalFees };
}
