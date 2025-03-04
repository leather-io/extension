import type { MarketData } from '@leather.io/models';
import { Approver, ItemLayout, Pressable } from '@leather.io/ui';

import type { Fee } from '@app/features/fee-editor/fee-editor.context';
import { formatFeeItem } from '@app/features/fee-editor/fee-editor.utils';

import { CryptoAssetItemPlaceholder } from '../../../components/crypto-asset-item/crypto-asset-item-placeholder';
import { FeeItemIcon } from './fee-item-icon';

interface SelectedFeeItemProps {
  isLoading: boolean;
  marketData: MarketData;
  onEditFee(): void;
  selectedFee: Fee | null;
}
export function SelectedFeeItem({
  isLoading,
  marketData,
  onEditFee,
  selectedFee,
}: SelectedFeeItemProps) {
  if (isLoading || !selectedFee)
    return (
      <Approver.Section>
        <Approver.Subheader>Fee</Approver.Subheader>
        <CryptoAssetItemPlaceholder my="0" />
      </Approver.Section>
    );
  const { titleLeft, captionLeft, titleRight, captionRight } = formatFeeItem({
    fee: selectedFee,
    marketData: marketData,
  });
  return (
    <Approver.Section>
      <Approver.Subheader>Fee</Approver.Subheader>
      <Pressable onClick={onEditFee} mb="space.02">
        <ItemLayout
          img={<FeeItemIcon feeType={selectedFee.type} />}
          titleLeft={titleLeft}
          captionLeft={captionLeft}
          titleRight={titleRight}
          captionRight={captionRight}
          showChevron
        />
      </Pressable>
    </Approver.Section>
  );
}
