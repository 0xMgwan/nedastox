import { NextResponse } from 'next/server';

export const revalidate = 30; // refresh every 30s during trading hours

const DSE_LIVE_URL      = 'https://dse.co.tz/api/get/live/market/prices';
const DSE_GAINERS_URL   = 'https://dse.co.tz/get/gainers/losers';

const FETCH_OPTS = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Referer': 'https://dse.co.tz/market/data/overview',
  },
  next: { revalidate: 30 },
} as const;

export interface LiveStock {
  symbol:    string;
  price:     number;
  change:    number;
  changePct: number;
  volume:    number;
}

export async function GET() {
  try {
    const [liveRes, gainersRes] = await Promise.all([
      fetch(DSE_LIVE_URL, FETCH_OPTS),
      fetch(DSE_GAINERS_URL, FETCH_OPTS),
    ]);

    if (!liveRes.ok) throw new Error(`DSE live API ${liveRes.status}`);

    const liveData = await liveRes.json() as {
      success: boolean;
      data: { id: number; company: string; price: number; change: number }[];
    };

    let gainersData: { company: string; change: number; price: string; volume: string }[] = [];
    if (gainersRes.ok) {
      const gd = await gainersRes.json() as {
        success: boolean;
        gainers_and_losers: typeof gainersData;
      };
      if (gd.success) gainersData = gd.gainers_and_losers;
    }

    const volumeMap = new Map(
      gainersData.map(g => [g.company, parseInt(g.volume, 10) || 0])
    );
    // gainers endpoint uses more precise changePct
    const pctMap = new Map(
      gainersData.map(g => [g.company, g.change])
    );

    const stocks: LiveStock[] = liveData.data.map(item => ({
      symbol:    item.company,
      price:     item.price,
      change:    item.change,
      changePct: pctMap.get(item.company) ?? (item.price ? (item.change / (item.price - item.change)) * 100 : 0),
      volume:    volumeMap.get(item.company) ?? 0,
    }));

    return NextResponse.json({
      source:    'DSE Live API',
      fetchedAt: new Date().toISOString(),
      count:     stocks.length,
      stocks,
    });
  } catch (err) {
    console.error('DSE stocks fetch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 503 });
  }
}
