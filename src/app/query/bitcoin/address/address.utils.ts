import { BTC_DECIMALS } from '@shared/constants';
import { BitcoinCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';
import type { Money } from '@shared/models/money.model';

export function createBitcoinCryptoCurrencyAssetTypeWrapper(
  balance: Money
): BitcoinCryptoCurrencyAssetBalance {
  return {
    blockchain: 'bitcoin',
    balance,
    asset: {
      decimals: BTC_DECIMALS,
      hasMemo: true,
      name: 'Bitcoin',
      symbol: 'BTC',
    },
    type: 'crypto-currency',
  };
}
