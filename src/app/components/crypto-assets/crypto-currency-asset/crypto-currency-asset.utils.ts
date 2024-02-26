import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { AllCryptoCurrencyAssetBalances } from '@shared/models/crypto-asset-balance.model';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';
import { spamFilter } from '@app/common/utils/spam-filter';

export function parseCryptoCurrencyAssetBalance(assetBalance: AllCryptoCurrencyAssetBalances) {
  const { asset, balance } = assetBalance;

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals)
    : balance.amount.toString();
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    balance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(amount);
  const title = spamFilter(asset.name);

  return {
    balance,
    dataTestId,
    formattedBalance,
    title,
  };
}
