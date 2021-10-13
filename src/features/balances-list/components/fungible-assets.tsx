import React, { Suspense } from 'react';
import { Stack, StackProps } from '@stacks/ui';
import { AssetRow } from '@components/asset-row';
import { useAssetItemState, useFungibleTokenBaseState } from '@store/assets/asset.hooks';

import { AssetWithMeta } from '@common/asset-types';
import { useCurrentAccountBalancesUnanchoredState } from '@store/accounts/account.hooks';

interface FungibleAssetRowProps {
  asset: AssetWithMeta;
}
function FungibleAssetRow(props: FungibleAssetRowProps) {
  const asset = useAssetItemState(props.asset);
  if (!asset) return null;
  return <AssetRow asset={asset} />;
}

export function FungibleAssets(props: StackProps) {
  const fungibleTokens = useFungibleTokenBaseState();
  console.log(fungibleTokens);
  const balances = useCurrentAccountBalancesUnanchoredState();
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
