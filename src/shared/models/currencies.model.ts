import BigNumber from 'bignumber.js';

export type CryptoCurrencies = 'STX';
export type FiatCurrencies = 'USD';

export interface MarketPair {
  base: CryptoCurrencies;
  quote: FiatCurrencies;
  price: BigNumber;
}
