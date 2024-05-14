import { useFilteredStacksFungibleTokenList } from '@app/query/stacks/balance/stacks-ft-balances.hooks';

import { StacksFungibleTokenAssetListLayout } from './stacks-fungible-token-asset-list.layout';

interface StacksFungibleTokenAssetListProps {
  address: string;
}
export function StacksFungibleTokenAssetList({ address }: StacksFungibleTokenAssetListProps) {
  const stacksFilteredFtAssetBalances = useFilteredStacksFungibleTokenList({
    address,
    filter: 'supported',
  });

  return <StacksFungibleTokenAssetListLayout assetBalances={stacksFilteredFtAssetBalances} />;
}
