import type { MarketData } from '@leather.io/models';
import { Approver, ItemLayout, Pressable } from '@leather.io/ui';

import type { Fee, FeeType } from '@app/features/fee-editor/fee-editor.context';
import { formatFeeItem } from '@app/features/fee-editor/fee-editor.utils';

import { CryptoAssetItemPlaceholder } from '../../../components/crypto-asset-item/crypto-asset-item-placeholder';
import { FeeItemIcon } from './fee-item-icon';

interface SelectedFeeItemProps {
  feeType: FeeType;
  isLoading: boolean;
  marketData: MarketData;
  onEditFee(): void;
  selectedFee: Fee | null;
}
export function SelectedFeeItem({
  feeType,
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
    feeType,
    fee: selectedFee,
    marketData: marketData,
  });
  return (
    <Approver.Section>
      <Pressable onClick={onEditFee} my="space.02">
        <ItemLayout
          img={<FeeItemIcon priority={selectedFee.priority} />}
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
