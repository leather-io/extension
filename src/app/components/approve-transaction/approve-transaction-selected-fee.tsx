import { Approver, ItemLayout, Pressable } from '@leather.io/ui';

import type { FeeDisplayInfo } from '@app/features/fee-editor/fee-editor.context';

import { FeeItemIcon } from '../../features/fee-editor/components/fee-item-icon';
import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';

interface ApproveTransactionSelectedFeeProps {
  isLoading: boolean;
  selectedFeeData: FeeDisplayInfo | null;
  onChooseFee(): void;
}

export function ApproveTransactionSelectedFee({
  isLoading,
  selectedFeeData,
  onChooseFee,
}: ApproveTransactionSelectedFeeProps) {
  return (
    <Approver.Section>
      <Approver.Subheader>Fee</Approver.Subheader>
      <Pressable onClick={onChooseFee} mb="space.02">
        {isLoading || !selectedFeeData ? (
          <CryptoAssetItemPlaceholder my="0" />
        ) : (
          <ItemLayout
            img={<FeeItemIcon feeType={selectedFeeData.feeType} />}
            titleLeft={selectedFeeData.titleLeft}
            captionLeft={selectedFeeData.captionLeft}
            titleRight={selectedFeeData.titleRight}
            captionRight={selectedFeeData.captionRight}
            showChevron
          />
        )}
      </Pressable>
    </Approver.Section>
  );
}
