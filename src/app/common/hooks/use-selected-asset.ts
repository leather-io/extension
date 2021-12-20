import { useCallback, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { AssetWithMeta } from '@app/common/asset-types';
import { getTicker, initBigNumber } from '@app/common/utils';
import { ftDecimals, stacksValue } from '@app/common/stacks-utils';
import { useCurrentAccountAvailableStxBalance } from '@app/store/accounts/account.hooks';
import { useSelectedAssetState, useUpdateSelectedAsset } from '@app/store/assets/asset.hooks';
import { useAnalytics } from './analytics/use-analytics';

export function getFullyQualifiedAssetName(asset?: AssetWithMeta) {
  return asset ? `${asset.contractAddress}.${asset.contractName}::${asset.name}` : undefined;
}

export function useSelectedAsset() {
  const selectedAsset = useSelectedAssetState();
  const setSelectedAsset = useUpdateSelectedAsset();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();
  const analytics = useAnalytics();
  const handleUpdateSelectedAsset = useCallback(
    (asset: AssetWithMeta | undefined) => {
      setSelectedAsset(getFullyQualifiedAssetName(asset) || undefined);
      void analytics.track('select_asset_for_send');
    },
    [analytics, setSelectedAsset]
  );
  const name = selectedAsset?.meta?.name || selectedAsset?.name;
  const isStx = selectedAsset?.name === 'Stacks Token';
  const ticker = selectedAsset
    ? isStx
      ? 'STX'
      : selectedAsset?.meta?.symbol || getTicker(selectedAsset.name)
    : null;

  const balance = useMemo<string | undefined>(() => {
    if (!selectedAsset) return;
    if (selectedAsset.type === 'stx')
      return stacksValue({ value: availableStxBalance || 0, withTicker: false });
    if (selectedAsset?.meta?.decimals)
      return ftDecimals(selectedAsset.balance, selectedAsset.meta?.decimals);
    return new BigNumber(selectedAsset.balance).toFormat();
  }, [selectedAsset, availableStxBalance]);

  const hasDecimals = isStx || (selectedAsset?.meta?.decimals && selectedAsset?.meta?.decimals > 0);
  const placeholder = selectedAsset
    ? `0${
        hasDecimals ? `.${'0'.repeat(isStx ? 6 : selectedAsset.meta?.decimals || 0)}` : ''
      } ${ticker}`
    : '';

  return {
    selectedAsset,
    handleUpdateSelectedAsset,
    ticker,
    balance,
    balanceBigNumber: balance ? initBigNumber(balance.replace(/,/g, '')) : undefined,
    name,
    placeholder,
  };
}
