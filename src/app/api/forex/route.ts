import { NextResponse } from 'next/server';

export const revalidate = 60; // cache 60 seconds

export async function GET() {
  try {
    // ExchangeRate-API free endpoint — no key required, updates every 24h
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const rates = data.rates as Record<string, number>;

    const usdToTzs = rates['TZS'] ?? 2644;

    const pairs = [
      {
        id: 'tzs-usd',
        symbol: 'TZS/USD',
        name: 'Tanzania Shilling / US Dollar',
        rate: usdToTzs,          // TZS per 1 USD
        base: 'USD',
      },
      {
        id: 'tzs-eur',
        symbol: 'TZS/EUR',
        name: 'Tanzania Shilling / Euro',
        rate: usdToTzs / (rates['EUR'] ?? 0.92),   // TZS per 1 EUR
        base: 'EUR',
      },
      {
        id: 'tzs-gbp',
        symbol: 'TZS/GBP',
        name: 'Tanzania Shilling / British Pound',
        rate: usdToTzs / (rates['GBP'] ?? 0.79),
        base: 'GBP',
      },
      {
        id: 'tzs-kes',
        symbol: 'TZS/KES',
        name: 'Tanzania Shilling / Kenya Shilling',
        rate: usdToTzs / (rates['KES'] ?? 129),
        base: 'KES',
      },
    ];

    return NextResponse.json({
      source: 'ExchangeRate-API',
      fetchedAt: new Date().toISOString(),
      pairs,
    });
  } catch (err) {
    console.error('Forex fetch error:', err);
    // Fallback to last known rates if API is unavailable
    return NextResponse.json({
      source: 'fallback',
      fetchedAt: new Date().toISOString(),
      pairs: [
        { id: 'tzs-usd', symbol: 'TZS/USD', name: 'Tanzania Shilling / US Dollar', rate: 2644.50, base: 'USD' },
        { id: 'tzs-eur', symbol: 'TZS/EUR', name: 'Tanzania Shilling / Euro',       rate: 2870.30, base: 'EUR' },
        { id: 'tzs-gbp', symbol: 'TZS/GBP', name: 'Tanzania Shilling / British Pound', rate: 3340.80, base: 'GBP' },
        { id: 'tzs-kes', symbol: 'TZS/KES', name: 'Tanzania Shilling / Kenya Shilling', rate: 20.45, base: 'KES' },
      ],
    });
  }
}
