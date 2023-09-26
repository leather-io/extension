import { BTC_DECIMALS } from '@shared/constants';
import { BitcoinCryptoCurrencyAssetBalance } from '@shared/models/crypto-asset-balance.model';
import type { Money } from '@shared/models/money.model';
import { isEmptyArray } from '@shared/utils';

import { UtxoResponseItem } from '../bitcoin-client';

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

export function hasInscriptions(utxos: UtxoResponseItem[]) {
  return !isEmptyArray(utxos);
}
