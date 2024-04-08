import { type Money, createMoney } from '@shared/models/money.model';

import {
  checkIsMoneyAmountGreaterThanZero,
  convertCryptoCurrencyMoneyToFiat,
} from '@app/common/money/fiat-conversion';
import { unitToFractionalUnit } from '@app/common/money/unit-conversion';

import { SwapAsset } from './hooks/use-swap-form';

export const defaultSwapFee = createMoney(1000000, 'STX');

export function sortSwappableAssetsBySymbol(swappableAssets: SwapAsset[]) {
  return swappableAssets
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'STX') return -1;
      if (b.name !== 'STX') return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'BTC') return -1;
      if (b.name !== 'BTC') return 1;
      return 0;
    });
}

export function migratePositiveBalancesToTop(swappableAssets: SwapAsset[]) {
  const assetsWithPositiveBalance = swappableAssets.filter(asset =>
    asset.balance.amount.isGreaterThan(0)
  );
  const assetsWithZeroBalance = swappableAssets.filter(asset => asset.balance.amount.isEqualTo(0));
  return [...assetsWithPositiveBalance, ...assetsWithZeroBalance];
}

export function convertInputAmountValueToFiat(balance: Money, price: Money, value: string) {
  const valueAsMoney = createMoney(
    unitToFractionalUnit(balance.decimals)(value),
    balance.symbol,
    balance.decimals
  );

  if (!checkIsMoneyAmountGreaterThanZero(valueAsMoney)) return;
  return convertCryptoCurrencyMoneyToFiat(balance.symbol, price, valueAsMoney);
}
