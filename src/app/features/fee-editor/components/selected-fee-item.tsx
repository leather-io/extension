import type { MarketData } from '@leather.io/models';
import { Approver, Pressable } from '@leather.io/ui';

import { CryptoAssetItemPlaceholder } from '@app/components/crypto-asset-item/crypto-asset-item-placeholder';
import type { Fee, FeeType } from '@app/features/fee-editor/fee-editor.context';

import { FeeRateItemLayout } from './fee-rate-item.layout';
import { FeeValueItemLayout } from './fee-value-item.layout';

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

  return (
    <Approver.Section>
      <Pressable onClick={onEditFee} my="space.02">
        {feeType === 'fee-rate' ? (
          <FeeRateItemLayout fee={selectedFee} marketData={marketData} showChevron />
        ) : null}
        {feeType === 'fee-value' ? (
          <FeeValueItemLayout fee={selectedFee} marketData={marketData} showChevron />
        ) : null}
      </Pressable>
    </Approver.Section>
  );
}
