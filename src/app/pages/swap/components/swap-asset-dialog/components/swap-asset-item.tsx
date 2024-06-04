import { SwapSelectors } from '@tests/selectors/swap.selectors';

import { type SwapAsset, isFtAsset, useGetFungibleTokenMetadataQuery } from '@leather-wallet/query';
import { ItemLayout, Pressable } from '@leather-wallet/ui';
import { formatMoneyWithoutSymbol } from '@leather-wallet/utils';

import { convertAssetBalanceToFiat } from '@app/common/asset-utils';
import { Avatar, defaultFallbackDelay, getAvatarFallback } from '@app/ui/components/avatar/avatar';

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
