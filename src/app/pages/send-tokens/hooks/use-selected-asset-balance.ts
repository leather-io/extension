import { useMemo } from 'react';

import { getTicker } from '@app/common/utils';
import { ftDecimals, stacksValue } from '@app/common/stacks-utils';
import { useSelectedStacksCryptoAssetBalance } from '@app/query/stacks/balance/crypto-asset-balances.hooks';

export function useSelectedAssetBalance(assetId: string) {
  const selectedAssetBalance = useSelectedStacksCryptoAssetBalance(assetId);

  return useMemo(() => {
    const isStx =
      selectedAssetBalance?.asset.blockchain === 'stacks' &&
      selectedAssetBalance.asset.type === 'crypto-currency';

    const stxBalance = stacksValue({
      value: selectedAssetBalance?.balance.amount || 0,
      withTicker: false,
    });

    const ftBalance = selectedAssetBalance?.asset.decimals
      ? ftDecimals(selectedAssetBalance.balance.amount, selectedAssetBalance.asset.decimals)
      : selectedAssetBalance?.balance.amount.toFormat();
    const ticker = selectedAssetBalance
      ? selectedAssetBalance.asset.symbol || getTicker(selectedAssetBalance.asset.name)
      : null;
    const hasDecimals =
      selectedAssetBalance?.asset.decimals && selectedAssetBalance.asset.decimals > 0;
    const placeholder = `0${
      hasDecimals ? `.${'0'.repeat(isStx ? 6 : selectedAssetBalance.asset.decimals || 0)}` : ''
    } ${ticker}`;

    return {
      balance: stxBalance || ftBalance,
      isStx,
      name: selectedAssetBalance?.asset.name,
      placeholder,
      selectedAssetBalance,
      ticker,
    };
  }, [selectedAssetBalance]);
}
