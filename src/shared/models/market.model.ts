import { CryptoCurrencies, FiatCurrencies } from './currencies.model';
import { Money } from './money.model';

interface MarketPair {
  readonly base: CryptoCurrencies;
  readonly quote: FiatCurrencies;
}

export function createMarketPair(base: CryptoCurrencies, quote: FiatCurrencies): MarketPair {
  return { base, quote };
}

export function formatMarketPair({ base, quote }: MarketPair) {
  return `${base}/${quote}`;
}

export interface MarketData {
  readonly pair: MarketPair;
  readonly price: Money;
}

export function createMarketData(pair: MarketPair, price: Money): MarketData {
  return { pair, price };
}
