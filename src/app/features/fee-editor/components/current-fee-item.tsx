import type { MarketData } from '@leather.io/models';
import { Approver, ItemLayout, Pressable } from '@leather.io/ui';

import type { EditorFee } from '@app/features/fee-editor/fee-editor.context';
import { formatEditorFeeItem } from '@app/features/fee-editor/fee-editor.utils';

import { CryptoAssetItemPlaceholder } from '../../../components/crypto-asset-item/crypto-asset-item-placeholder';
import { FeeItemIcon } from './fee-item-icon';

interface CurrentFeeItemProps {
  currentFee: EditorFee | null;
  isLoading: boolean;
  marketData: MarketData;
  onEditFee(): void;
}
export function CurrentFeeItem({
  currentFee,
  isLoading,
  marketData,
  onEditFee,
}: CurrentFeeItemProps) {
  if (isLoading || !currentFee)
    return (
      <Approver.Section>
        <Approver.Subheader>Fee</Approver.Subheader>
        <CryptoAssetItemPlaceholder my="0" />
      </Approver.Section>
    );
  const { titleLeft, captionLeft, titleRight, captionRight } = formatEditorFeeItem({
    editorFee: currentFee,
    marketData: marketData,
  });
  return (
    <Approver.Section>
      <Approver.Subheader>Fee</Approver.Subheader>
      <Pressable onClick={onEditFee} mb="space.02">
        <ItemLayout
          img={<FeeItemIcon feeType={currentFee.type} />}
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
