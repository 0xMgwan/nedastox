import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 3600; // cache history for 1 hour

export interface HistoryPoint {
  date:          string;
  open:          number;
  high:          number;
  low:           number;
  close:         number;
  volume:        number;
  turnover:      number;
  marketCap:     number;
  sharesInIssue: number;
}

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get('symbol');
  const days   = parseInt(req.nextUrl.searchParams.get('days') ?? '90', 10);

  if (!symbol) return NextResponse.json({ error: 'symbol required' }, { status: 400 });

  try {
    const url = `https://dse.co.tz/api/get/market/prices/for/range/duration?security_code=${encodeURIComponent(symbol)}&days=${days}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://dse.co.tz/market/data/overview',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`DSE history API ${res.status}`);

    const raw = await res.json() as {
      success: boolean;
      data: {
        trade_date:     string;
        company:        string;
        fullName:       string;
        turnover:       number;
        volume:         number;
        high:           number;
        low:            number;
        opening_price:  number;
        closing_price:  number;
        shares_in_issue:number;
        market_cap:     number;
      }[];
    };

    if (!raw.success || !raw.data?.length) {
      return NextResponse.json({ error: 'No data returned', symbol }, { status: 404 });
    }

    const history: HistoryPoint[] = raw.data.map(row => ({
      date:          row.trade_date.split('T')[0],
      open:          row.opening_price,
      high:          row.high,
      low:           row.low,
      close:         row.closing_price,
      volume:        row.volume,
      turnover:      row.turnover,
      marketCap:     row.market_cap,
      sharesInIssue: row.shares_in_issue,
    }));

    const closes    = history.map(h => h.close).filter(Boolean);
    const high52w   = closes.length ? Math.max(...closes) : 0;
    const low52w    = closes.length ? Math.min(...closes) : 0;
    const lastRow   = raw.data[raw.data.length - 1];

    return NextResponse.json({
      symbol,
      fullName:      lastRow.fullName,
      marketCap:     lastRow.market_cap,
      sharesInIssue: lastRow.shares_in_issue,
      high52w,
      low52w,
      fetchedAt: new Date().toISOString(),
      history,
    });
  } catch (err) {
    console.error('DSE history error:', err);
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}
