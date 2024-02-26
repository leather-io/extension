import { SwapSelectors } from '@tests/selectors/swap.selectors';
import { styled } from 'leather-styles/jsx';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '@app/query/stacks/tokens/token-metadata.utils';
import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemLayout } from '@app/ui/components/item/item.layout';

import { useAlexSdkBalanceAsFiat } from '../../hooks/use-alex-sdk-fiat-price';
import { SwapAsset } from '../../hooks/use-swap-form';

interface SwapAssetItemProps {
  asset: SwapAsset;
  onClick(): void;
}
export function SwapAssetItem({ asset, onClick }: SwapAssetItemProps) {
  const balanceAsFiat = useAlexSdkBalanceAsFiat(asset.balance, asset.price);
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(asset.principal);

  const ftMetadataName = ftMetadata && isFtAsset(ftMetadata) ? ftMetadata.name : asset.name;
  const displayName = asset.displayName ?? ftMetadataName;

  return (
    <ItemInteractive data-testid={SwapSelectors.ChooseAssetListItem} onClick={onClick}>
      <ItemLayout
        flagImg={<styled.img src={asset.icon} width="40px" height="40px" alt="Swap asset" />}
        titleLeft={displayName}
        captionLeft={asset.name}
        titleRight={formatMoneyWithoutSymbol(asset.balance)}
        captionRight={balanceAsFiat}
      />
    </ItemInteractive>
  );
}
