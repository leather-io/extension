import type { Money } from '@leather-wallet/models';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { formatBalance } from '@app/common/format-balance';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

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
