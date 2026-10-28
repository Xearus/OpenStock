import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchLocalStocks } from '@/lib/local-market-search';

describe('account-free market search', () => {
    it('finds companies and international tickers without a provider request', () => {
        expect(searchLocalStocks('apple').some((stock) => stock.symbol === 'AAPL')).toBe(true);
        expect(searchLocalStocks('royal bank').some((stock) => stock.symbol === 'TSX:RY')).toBe(true);
        expect(searchLocalStocks().length).toBeGreaterThan(0);
    });

    it('opens explicit tickers honestly, without inventing validation or accepting paths', () => {
        expect(searchLocalStocks('TSX:XIU')[0]).toMatchObject({
            symbol: 'TSX:XIU', name: expect.stringContaining('availability checked by TradingView'),
        });
        expect(searchLocalStocks('../not-a-ticker')).toEqual([]);
        expect(searchLocalStocks('A'.repeat(65))).toEqual([]);
    });
});

describe('widgets-only routing', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it('routes US and Canadian markets to keyless quotes without changing other market metadata', async () => {
        vi.stubEnv('NEXT_PUBLIC_OPENSTOCK_WIDGETS_ONLY', 'true');
        vi.resetModules();
        const { getMarket, hasFinnhubQuotes } = await import('@/lib/markets');
        expect(getMarket('us').pulse.every((tile) => !tile.finnhub)).toBe(true);
        expect(getMarket('ca').pulse.some((tile) => tile.symbol === 'TSX:RY')).toBe(true);
        expect(hasFinnhubQuotes('AAPL')).toBe(false);
    });
});
