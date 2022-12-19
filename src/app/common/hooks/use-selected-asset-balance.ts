import { useMemo } from 'react';

import { formatMoney } from '@app/common/money/format-money';
import { ftDecimals } from '@app/common/stacks-utils';
import { getTicker } from '@app/common/utils';
import { useStacksCryptoAssetBalanceByAssetId } from '@app/query/stacks/balance/crypto-asset-balances.hooks';

export function useSelectedAssetBalance(assetId: string) {
  const selectedAssetBalance = useStacksCryptoAssetBalanceByAssetId(assetId);

  return useMemo(() => {
    const isStx =
      selectedAssetBalance?.blockchain === 'stacks' &&
      selectedAssetBalance.type === 'crypto-currency';

    const formattedSelectedAssetBalance = selectedAssetBalance?.balance
      ? formatMoney(selectedAssetBalance.balance)
      : '';

    const ftBalance = selectedAssetBalance?.asset.decimals
      ? ftDecimals(selectedAssetBalance.balance.amount, selectedAssetBalance.asset.decimals)
      : selectedAssetBalance?.balance.amount.toFormat();

    const ticker = selectedAssetBalance
      ? selectedAssetBalance.asset.symbol || getTicker(selectedAssetBalance.asset.name)
      : '';

    const hasDecimals =
      selectedAssetBalance?.asset.decimals && selectedAssetBalance.asset.decimals > 0;

    const placeholder = `0${
      hasDecimals ? `.${'0'.repeat(selectedAssetBalance.asset.decimals ?? 0)}` : ''
    } ${ticker}`;

    return {
      balanceFormatted: formattedSelectedAssetBalance || ftBalance,
      isStx,
      name: selectedAssetBalance?.asset.name,
      placeholder,
      selectedAssetBalance,
      ticker,
    };
  }, [selectedAssetBalance]);
}
