import { SwapAsset } from './hooks/use-swap-form';

export function sortSwappableAssetsBySymbol(swappableAssets: SwapAsset[]) {
  return swappableAssets
    .sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'STX') return -1;
      if (b.name !== 'STX') return 1;
      return 0;
    })
    .sort((a, b) => {
      if (a.name === 'BTC') return -1;
      if (b.name !== 'BTC') return 1;
      return 0;
    });
}

export function migratePositiveBalancesToTop(swappableAssets: SwapAsset[]) {
  const assetsWithPositiveBalance = swappableAssets.filter(asset =>
    asset.balance.amount.isGreaterThan(0)
  );
  const assetsWithZeroBalance = swappableAssets.filter(asset => asset.balance.amount.isEqualTo(0));
  return [...assetsWithPositiveBalance, ...assetsWithZeroBalance];
}
