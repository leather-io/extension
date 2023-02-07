import { BitcoinFeeEstimate } from '@shared/models/fees/bitcoin-fees.model';
import { StacksFeeEstimate } from '@shared/models/fees/stacks-fees.model';

import { FeeEstimateItem } from './fee-estimate-item';
import { FeeEstimateSelectLayout } from './fee-estimate-select.layout';

interface FeeEstimateSelectProps {
  isVisible: boolean;
  estimate: BitcoinFeeEstimate[] | StacksFeeEstimate[];
  onSelectItem(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function FeeEstimateSelect(props: FeeEstimateSelectProps) {
  const { isVisible, estimate, onSelectItem, onSetIsSelectVisible, selectedItem } = props;

  return (
    <FeeEstimateSelectLayout
      isVisible={isVisible}
      onSelectItem={onSelectItem}
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
    </FeeEstimateSelectLayout>
  );
}
