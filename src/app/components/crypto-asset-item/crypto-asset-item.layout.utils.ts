import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import type { Money } from '@leather.io/models';
import { formatMoneyWithoutSymbol } from '@leather.io/utils';

import { formatBalance } from '@app/common/format-balance';

export function parseCryptoAssetBalance(availableBalance: Money) {
  const availableBalanceString = formatMoneyWithoutSymbol(availableBalance);
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    availableBalance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(availableBalanceString);

  return {
    availableBalanceString,
    dataTestId,
    formattedBalance,
  };
}
