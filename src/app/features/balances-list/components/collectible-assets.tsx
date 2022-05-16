import { memo } from 'react';
import { Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';
import { getAssetStringParts } from '@stacks/ui-utils';

import { AssetItem } from '@app/components/asset-item';
import { useCurrentAccountUnanchoredBalances } from '@app/query/balance/balance.hooks';

export const CollectibleAssets = memo((props: StackProps) => {
  const { data: balances } = useCurrentAccountUnanchoredBalances();
  if (!balances) return null;
  const noCollectibles = Object.keys(balances.non_fungible_tokens).length === 0;
  if (noCollectibles) return null;
  const keys = Object.keys(balances.non_fungible_tokens);

  return (
    <Stack {...props}>
      {keys
        .filter(key => Number(balances.non_fungible_tokens[key].count) > 0)
        .map(key => {
          const collectible = balances.non_fungible_tokens[key];
          const { assetName, contractName } = getAssetStringParts(key);

          return (
            <AssetItem
              amount={collectible.count}
              avatar={key}
              title={assetName}
              caption={contractName}
              key={key}
            />
          );
        })}
    </Stack>
  );
});
