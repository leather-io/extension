import type { LiteralUnion } from 'leather-styles/types';

export type CryptoCurrencies = LiteralUnion<'BTC' | 'STX', string>;

export type FiatCurrencies = 'USD' | string;
