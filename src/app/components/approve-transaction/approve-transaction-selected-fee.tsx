import { Approver, ItemLayout, Pressable } from '@leather.io/ui';

import type { FeeDisplayInfo } from '@app/common/fees/use-fees';

import { CryptoAssetItemPlaceholder } from '../crypto-asset-item/crypto-asset-item-placeholder';
import { FeeItemIcon } from '../fees/fee-item-icon';

interface ApproveTransactionSelectedFeeProps {
  isLoading: boolean;
  selectedFeeData: FeeDisplayInfo;
  onChooseTransferFee(): void;
}

export function ApproveTransactionSelectedFee({
  isLoading,
  selectedFeeData,
  onChooseTransferFee,
}: ApproveTransactionSelectedFeeProps) {
  return (
    <Approver.Section>
      <Approver.Subheader>Fee</Approver.Subheader>
      <Pressable onClick={onChooseTransferFee} mb="space.02">
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
