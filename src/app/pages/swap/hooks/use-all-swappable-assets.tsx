import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { SwapAsset } from '@leather.io/query';
import { isDefined, migratePositiveAssetBalancesToTop } from '@leather.io/utils';

import { useConfigSbtc } from '@app/query/common/remote-config/remote-config.query';
import { useCurrentStacksAccountAddress } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

import { useBtcSwapAsset } from './use-bitcoin-bridge-assets';
import { useBitflowSwappableAssets } from './use-bitflow-swappable-assets';

const bitflowSbtcTokenId = 'token-sbtc';

function getBitflowSwappableAssetsWithSbtcAtTop(assets: SwapAsset[]) {
  const bitflowSbtcAsset = assets.find(asset => asset.tokenId === bitflowSbtcTokenId);
  const bitflowAssetsWithSbtcRemoved = assets.filter(asset => asset.tokenId !== bitflowSbtcTokenId);
  return [
    bitflowSbtcAsset,
    ...migratePositiveAssetBalancesToTop(bitflowAssetsWithSbtcRemoved),
  ].filter(isDefined);
}

export function useAllSwappableAssets() {
  const { origin } = useParams();
  const address = useCurrentStacksAccountAddress();
  const { data: bitflowSwapAssets = [] } = useBitflowSwappableAssets(address);
  const { isSbtcEnabled } = useConfigSbtc();

  const btcAsset = useBtcSwapAsset();
  const sortedStacksSwapAssetsWithoutSbtc = useMemo(
    () => migratePositiveAssetBalancesToTop(bitflowSwapAssets),
    [bitflowSwapAssets]
  );
  const sortedStacksSwapAssetsWithSbtc = useMemo(
    () => getBitflowSwappableAssetsWithSbtcAtTop(bitflowSwapAssets),
    [bitflowSwapAssets]
  );
  const allSwappableAssets = useMemo(() => {
    if (!isSbtcEnabled) return sortedStacksSwapAssetsWithoutSbtc;
    return [btcAsset, ...sortedStacksSwapAssetsWithSbtc];
  }, [btcAsset, isSbtcEnabled, sortedStacksSwapAssetsWithSbtc, sortedStacksSwapAssetsWithoutSbtc]);

  function getSwappableAssetsQuote(origin?: string) {
    switch (origin) {
      case 'bitcoin':
        return bitflowSwapAssets.filter(asset => asset.name === 'sBTC');
      case 'stacks':
        return isSbtcEnabled ? sortedStacksSwapAssetsWithSbtc : bitflowSwapAssets;
      default:
        return allSwappableAssets;
    }
  }

  return {
    swappableAssetsBase: allSwappableAssets,
    swappableAssetsQuote: getSwappableAssetsQuote(origin),
  };
}
