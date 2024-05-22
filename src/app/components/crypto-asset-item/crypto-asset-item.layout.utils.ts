import type { CryptoAssetBalance } from '@leather-wallet/models';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { formatBalance } from '@app/common/format-balance';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';

export function parseCryptoAssetBalance(balance: CryptoAssetBalance) {
  const { availableBalance } = balance;

  const amount = formatMoneyWithoutSymbol(availableBalance);
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    availableBalance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(amount);

  return {
    availableBalance,
    dataTestId,
    formattedBalance,
  };
}
