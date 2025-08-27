import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { sanitize } from 'dompurify';

import { isFtAsset } from '@leather.io/query';
import { Avatar, ItemLayout, Pressable } from '@leather.io/ui';
import { isString } from '@leather.io/utils';

import { formatCurrency } from '@app/common/currency-formatter';
import { convertSwapAssetBalanceToFiat } from '@app/pages/swap/swap.utils';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/token-metadata/fungible-tokens/fungible-token-metadata.query';

interface SwapAssetItemProps {
  asset: SwapAsset;
  onClick(): void;
}
export function SwapAssetItem({ asset, onClick }: SwapAssetItemProps) {
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(asset.principal);

  const ftMetadataName = ftMetadata && isFtAsset(ftMetadata) ? ftMetadata.name : asset.name;
  const displayName = asset.displayName ?? ftMetadataName;
  const fallback = asset.name.slice(0, 2);
  const fiatBalance = convertSwapAssetBalanceToFiat(asset);

  return (
    <Pressable data-testid={SwapSelectors.SwapAssetListItem} onClick={onClick} my="space.02">
      <ItemLayout
        img={
          isString(asset.icon) ? (
            <Avatar image={sanitize(asset.icon)} fallback={fallback} />
          ) : (
            asset.icon
          )
        }
        titleLeft={displayName}
        captionLeft={asset.name}
        titleRight={formatCurrency(asset.balance, { showCurrency: false })}
        captionRight={fiatBalance}
      />
    </Pressable>
  );
}
