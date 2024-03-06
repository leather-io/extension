import { useStacksFungibleTokenAssetBalancesWithMetadata } from '@app/query/stacks/balance/stacks-ft-balances.hooks';

import { StacksFungibleTokenAssetListLayout } from './stacks-fungible-token-asset-list.layout';

interface StacksFungibleTokenAssetListProps {
  address: string;
}
export function StacksFungibleTokenAssetList({ address }: StacksFungibleTokenAssetListProps) {
  const stacksFtAssetBalances = useStacksFungibleTokenAssetBalancesWithMetadata(address);
  return <StacksFungibleTokenAssetListLayout assetBalances={stacksFtAssetBalances} />;
}
