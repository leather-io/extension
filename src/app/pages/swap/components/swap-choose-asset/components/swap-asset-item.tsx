import { SwapSelectors } from '@tests/selectors/swap.selectors';

import { useAlexSdkBalanceAsFiat } from '@app/common/hooks/use-alex-sdk';
import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import type { SwapAsset } from '@app/pages/swap/hooks/use-swap-form';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '@app/query/stacks/tokens/token-metadata.utils';
import { Avatar, defaultFallbackDelay, getAvatarFallback } from '@app/ui/components/avatar/avatar';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { Pressable } from '@app/ui/components/pressable/pressable';

interface SwapAssetItemProps {
  asset: SwapAsset;
  onClick(): void;
}
export function SwapAssetItem({ asset, onClick }: SwapAssetItemProps) {
  const balanceAsFiat = useAlexSdkBalanceAsFiat(asset.balance, asset.price);
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(asset.principal);

  const ftMetadataName = ftMetadata && isFtAsset(ftMetadata) ? ftMetadata.name : asset.name;
  const displayName = asset.displayName ?? ftMetadataName;
  const fallback = getAvatarFallback(asset.name);

  return (
    <Pressable data-testid={SwapSelectors.ChooseAssetListItem} onClick={onClick} my="space.02">
      <ItemLayout
        img={
          <Avatar.Root>
            <Avatar.Image alt={fallback} src={asset.icon} />
            <Avatar.Fallback delayMs={defaultFallbackDelay}>{fallback}</Avatar.Fallback>
          </Avatar.Root>
        }
        titleLeft={displayName}
        captionLeft={asset.name}
        titleRight={formatMoneyWithoutSymbol(asset.balance)}
        captionRight={balanceAsFiat}
      />
    </Pressable>
  );
}
