const CRYPTO_CURRENCIES_ARRAY = ['BTC', 'STX'] as const;

export type CryptoCurrencies = (typeof CRYPTO_CURRENCIES_ARRAY)[number];

export const isCryptoCurrency = (value: unknown): value is CryptoCurrencies =>
  CRYPTO_CURRENCIES_ARRAY.some(cryptocurrency => cryptocurrency === value);

export type FiatCurrencies = 'USD' | string;

export type Currencies = CryptoCurrencies | FiatCurrencies;
