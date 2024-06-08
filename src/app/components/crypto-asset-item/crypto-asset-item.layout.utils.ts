import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import type { Money } from '@leather-wallet/models';
import { formatMoneyWithoutSymbol } from '@leather-wallet/utils';

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
