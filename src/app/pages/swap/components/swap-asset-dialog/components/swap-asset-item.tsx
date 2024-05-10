import { SwapSelectors } from '@tests/selectors/swap.selectors';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import type { SwapAsset } from '@app/query/common/alex-sdk/alex-sdk.hooks';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/token-metadata/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '@app/query/stacks/token-metadata/token-metadata.utils';
import { Avatar, defaultFallbackDelay, getAvatarFallback } from '@app/ui/components/avatar/avatar';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { Pressable } from '@app/ui/pressable/pressable';

interface SwapAssetItemProps {
  asset: SwapAsset;
  onClick(): void;
}
export function SwapAssetItem({ asset, onClick }: SwapAssetItemProps) {
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(asset.principal);

  const ftMetadataName = ftMetadata && isFtAsset(ftMetadata) ? ftMetadata.name : asset.name;
  const displayName = asset.displayName ?? ftMetadataName;
  const fallback = getAvatarFallback(asset.name);
  const fiatBalance = convertAssetBalanceToFiat(asset);

  return (
    <Pressable data-testid={SwapSelectors.SwapAssetListItem} onClick={onClick} my="space.02">
      <ItemLayout
        flagImg={
          <Avatar.Root>
            <Avatar.Image alt={fallback} src={asset.icon} />
            <Avatar.Fallback delayMs={defaultFallbackDelay}>{fallback}</Avatar.Fallback>
          </Avatar.Root>
        }
        titleLeft={displayName}
        captionLeft={asset.name}
        titleRight={formatMoneyWithoutSymbol(asset.balance)}
        captionRight={fiatBalance}
      />
    </Pressable>
  );
}
