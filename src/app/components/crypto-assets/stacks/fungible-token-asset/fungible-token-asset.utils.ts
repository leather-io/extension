import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import type { StacksFungibleTokenAssetBalance } from '@shared/models/crypto-asset-balance.model';

import { getImageCanonicalUri } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { formatBalance } from '@app/common/format-balance';
import {
  checkIsMoneyAmountGreaterThanZero,
  convertCryptoCurrencyMoneyToFiat,
} from '@app/common/money/fiat-conversion';
import { i18nFormatCurrency } from '@app/common/money/format-money';
import { ftDecimals } from '@app/common/stacks-utils';
import { formatContractId, getTicker } from '@app/common/utils';
import { spamFilter } from '@app/common/utils/spam-filter';
import { getAssetName } from '@app/ui/utils/get-asset-name';

export function parseStacksFungibleTokenAssetBalance(
  assetBalance: StacksFungibleTokenAssetBalance
) {
  const { asset, balance } = assetBalance;
  const { contractAddress, contractAssetName, contractName, name, symbol } = asset;

  const amount = balance.decimals
    ? ftDecimals(balance.amount, balance.decimals || 0)
    : balance.amount.toString();
  const avatar = `${formatContractId(contractAddress, contractName)}::${contractAssetName}`;
  const dataTestId =
    symbol && CryptoAssetSelectors.CryptoAssetListItem.replace('{symbol}', symbol.toLowerCase());
  const formattedBalance = formatBalance(amount);
  const friendlyName =
    name ||
    (contractAssetName.includes('::') ? getAssetName(contractAssetName) : contractAssetName);
  const imageCanonicalUri = getImageCanonicalUri(asset.imageCanonicalUri, asset.name);
  const caption = symbol || getTicker(friendlyName);
  const title = spamFilter(friendlyName);

  const showFiatBalance =
    assetBalance.asset.price && checkIsMoneyAmountGreaterThanZero(assetBalance.asset.price);
  const balanceAsFiat = showFiatBalance
    ? assetBalance.asset.price &&
      i18nFormatCurrency(
        convertCryptoCurrencyMoneyToFiat(
          assetBalance.balance.symbol,
          assetBalance.asset.price,
          assetBalance.balance
        )
      )
    : '';

  return {
    amount,
    avatar,
    balanceAsFiat,
    caption,
    dataTestId,
    formattedBalance,
    imageCanonicalUri,
    title,
  };
}
