import { useMemo } from 'react';

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

  const bitcoinSwappableAssetsQuote = useMemo(
    () => bitflowSwapAssets.filter(asset => asset.name === 'sBTC'),
    [bitflowSwapAssets]
  );
  const stacksSwappableAssetsQuote = useMemo(
    () => (isSbtcEnabled ? sortedStacksSwapAssetsWithSbtc : bitflowSwapAssets),
    [isSbtcEnabled, sortedStacksSwapAssetsWithSbtc, bitflowSwapAssets]
  );

  return {
    allSwappableAssets,
    bitcoinSwappableAssetsQuote,
    stacksSwappableAssetsQuote,
  };
}
