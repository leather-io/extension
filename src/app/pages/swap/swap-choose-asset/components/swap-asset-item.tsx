import { HStack, styled } from 'leather-styles/jsx';

import { formatMoneyWithoutSymbol } from '@app/common/money/format-money';
import { usePressable } from '@app/components/item-hover';
import { useGetFungibleTokenMetadataQuery } from '@app/query/stacks/tokens/fungible-tokens/fungible-token-metadata.query';
import { isFtAsset } from '@app/query/stacks/tokens/token-metadata.utils';

import { useAlexSdkBalanceAsFiat } from '../../hooks/use-alex-sdk-fiat-price';
import { SwapAsset } from '../../hooks/use-swap-form';
import { SwapAssetItemLayout } from './swap-asset-item.layout';

interface SwapAssetItemProps {
  asset: SwapAsset;
}
export function SwapAssetItem({ asset }: SwapAssetItemProps) {
  const [component, bind] = usePressable(true);
  const balanceAsFiat = useAlexSdkBalanceAsFiat(asset.balance, asset.price);
  const { data: ftMetadata } = useGetFungibleTokenMetadataQuery(asset.principal);

  const ftMetadataName = ftMetadata && isFtAsset(ftMetadata) ? ftMetadata.name : asset.name;
  const displayName = asset.displayName ?? ftMetadataName;

  return (
    <SwapAssetItemLayout
      icon={<styled.img src={asset.icon} width="40px" height="40px" alt="Swap asset" />}
      {...bind}
    >
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="label.01">{displayName}</styled.span>
        <styled.span textStyle="label.01">{formatMoneyWithoutSymbol(asset.balance)}</styled.span>
      </HStack>
      <HStack alignItems="center" justifyContent="space-between">
        <styled.span textStyle="caption.01">{asset.name}</styled.span>
        <styled.span color="accent.text-subdued" textStyle="caption.01">
          {balanceAsFiat}
        </styled.span>
      </HStack>
      {component}
    </SwapAssetItemLayout>
  );
}
