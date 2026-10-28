import { POPULAR_STOCKS } from '@/lib/constants';
import { MARKETS } from '@/lib/markets';
import { US_TICKERS } from '@/lib/seo/tickers';

const catalog = [...new Map([
    ...POPULAR_STOCKS,
    ...US_TICKERS,
    ...MARKETS.flatMap((market) => market.groups.flatMap((group) =>
        group.symbols.map(([symbol, name]) => ({ symbol, name, exchange: symbol.split(':')[0] })),
    )),
].map((stock) => [stock.symbol, stock])).values()];

export function searchLocalStocks(query = ''): StockWithWatchlistStatus[] {
    const term = query.trim().toUpperCase();
    if (term.length > 64) return [];
    const matches = term
        ? catalog.filter((stock) => stock.symbol.toUpperCase().includes(term) || stock.name.toUpperCase().includes(term))
        : POPULAR_STOCKS;
    if (!matches.length && /^[A-Z0-9][A-Z0-9.&:-]{0,24}$/.test(term)) {
        return [{
            symbol: term, name: `Open ${term} (availability checked by TradingView)`,
            exchange: 'TradingView', type: 'Ticker', isInWatchlist: false,
        }];
    }
    return matches.slice(0, 15).map((stock) => ({
        symbol: stock.symbol, name: stock.name, exchange: stock.exchange,
        type: 'Stock / ETF', isInWatchlist: false,
    }));
}
