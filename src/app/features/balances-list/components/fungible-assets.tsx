import { Suspense } from 'react';
import { Stack, StackProps } from '@stacks/ui';
import { AssetRow } from '@app/components/asset-row';
import { useAssetWithMetadata, useFungibleTokenBaseState } from '@app/store/assets/asset.hooks';

import { Asset } from '@app/common/asset-types';
import { useCurrentAccountUnanchoredBalances } from '@app/query/stacks/balance/balance.hooks';

interface FungibleAssetRowProps {
  asset: Asset;
}
function FungibleAssetRow({ asset }: FungibleAssetRowProps) {
  const assetWithMeta = useAssetWithMetadata(asset);
  return <AssetRow asset={assetWithMeta} />;
}

export function FungibleAssets(props: StackProps) {
  const fungibleTokens = useFungibleTokenBaseState();
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  if (!balances) return null;

  const ftCount = Object.keys(balances.fungible_tokens);
  const noTokens = ftCount.length === 0;

  if (noTokens || !fungibleTokens) return null;

  return (
    <Stack spacing="loose" {...props}>
      {fungibleTokens?.map(asset => (
        <Suspense fallback={<AssetRow asset={asset} />} key={asset.name}>
          <FungibleAssetRow asset={asset} />
        </Suspense>
      ))}
    </Stack>
  );
}
