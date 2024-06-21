import { FeeTypes, type StacksFeeEstimate } from '@leather.io/models';

import { FeeEstimateItem } from './fee-estimate-item';
import { FeeEstimateSelectLayout } from './fee-estimate-select.layout';

interface FeeEstimateSelectProps {
  isVisible: boolean;
  estimate: StacksFeeEstimate[];
  onSelectItem(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
  allowCustom: boolean;
  disableFeeSelection?: boolean;
}
export function FeeEstimateSelect({
  isVisible,
  estimate,
  onSelectItem,
  onSetIsSelectVisible,
  selectedItem,
  allowCustom,
  disableFeeSelection,
}: FeeEstimateSelectProps) {
  return (
    <FeeEstimateSelectLayout
      disableFeeSelection={disableFeeSelection}
      isVisible={isVisible}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedItem={selectedItem}
    >
      {estimate.map((estimate, index) => (
        <FeeEstimateItem
          index={index}
          isVisible={isVisible}
          key={estimate.fee.amount.toNumber()}
          onSelectItem={onSelectItem}
          selectedItem={selectedItem}
        />
      ))}
      {allowCustom && (
        <FeeEstimateItem
          index={FeeTypes.Custom}
          isVisible={isVisible}
          onSelectItem={onSelectItem}
          selectedItem={selectedItem}
        />
      )}
    </FeeEstimateSelectLayout>
  );
}
