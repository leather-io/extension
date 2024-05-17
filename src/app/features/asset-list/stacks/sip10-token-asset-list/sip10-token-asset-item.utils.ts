import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { formatBalance } from '@app/common/format-balance';
import { ftDecimals, getSafeImageCanonicalUri } from '@app/common/stacks-utils';
import { spamFilter } from '@app/common/utils/spam-filter';
import type { Sip10AccountCryptoAssetWithDetails } from '@app/query/models/crypto-asset.model';

export function parseSip10TokenCryptoAssetBalance(asset: Sip10AccountCryptoAssetWithDetails) {
  const { balance, info } = asset;
  const { contractId, decimals, imageCanonicalUri, name, symbol } = info;

  const amount = ftDecimals(balance.availableBalance.amount, decimals);
  const avatar = contractId;
  const dataTestId =
    symbol && CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', symbol.toLowerCase());
  const formattedBalance = formatBalance(amount);
  const safeImageCanonicalUri = getSafeImageCanonicalUri(imageCanonicalUri, name);
  const title = spamFilter(name);
  const fiatBalance = convertAssetBalanceToFiat({
    ...asset,
    balance: asset.balance.availableBalance,
  });

  return {
    amount,
    avatar,
    fiatBalance,
    dataTestId,
    formattedBalance,
    imageCanonicalUri: safeImageCanonicalUri,
    title,
  };
}
