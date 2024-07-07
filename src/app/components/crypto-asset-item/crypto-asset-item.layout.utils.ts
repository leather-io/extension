import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import type { Money } from '@leather.io/models';
import { formatMoneyWithoutSymbol } from '@leather.io/utils';

import { formatBalance } from '@app/common/format-balance';

export function parseCryptoAssetBalance(availableBalance: Money) {
  const availableBalanceString = formatMoneyWithoutSymbol(availableBalance);
  const formattedBalance = formatBalance(availableBalanceString);

  return {
    availableBalanceString,
    formattedBalance,
  };
}

export function getCryptoDataTestId(symbol: string) {
  return CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', symbol.toLowerCase());
}
