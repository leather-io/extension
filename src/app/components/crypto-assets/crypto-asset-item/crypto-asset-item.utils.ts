import type {
  BtcCryptoAssetInfo,
  CryptoAssetBalances,
  StxCryptoAssetInfo,
} from '@leather-wallet/models';
import { CryptoAssetSelectors } from '@tests/selectors/crypto-asset.selectors';

import { BTC_DECIMALS, STX_DECIMALS } from '@shared/constants';

import { formatBalance } from '@app/common/format-balance';
import { ftDecimals } from '@app/common/stacks-utils';

export const btcCryptoAssetInfo: BtcCryptoAssetInfo = {
  decimals: BTC_DECIMALS,
  hasMemo: true,
  name: 'bitcoin',
  symbol: 'BTC',
};

export const stxCryptoAssetInfo: StxCryptoAssetInfo = {
  decimals: STX_DECIMALS,
  hasMemo: true,
  name: 'stacks',
  symbol: 'STX',
};

export function parseCryptoAssetBalance(balance: CryptoAssetBalances) {
  const { availableBalance } = balance;

  const amount = availableBalance.decimals
    ? ftDecimals(availableBalance.amount, availableBalance.decimals)
    : availableBalance.amount.toString();
  const dataTestId = CryptoAssetSelectors.CryptoAssetListItem.replace(
    '{symbol}',
    availableBalance.symbol.toLowerCase()
  );
  const formattedBalance = formatBalance(amount);

  return {
    balance,
    dataTestId,
    formattedBalance,
  };
}
