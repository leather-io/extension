import { RecipientSelectItem } from './recipient-select-item';
import { RecipientSelectLayout } from './recipient-select.layout';

export enum RecipientFieldType {
  Address,
  BnsName,
}

interface RecipientSelectProps {
  isVisible: boolean;
  onSelectItem(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function RecipientSelect(props: RecipientSelectProps) {
  const { isVisible, onSelectItem, onSetIsSelectVisible, selectedItem } = props;

  return (
    <RecipientSelectLayout
      isVisible={isVisible}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedItem={selectedItem}
    >
      <RecipientSelectItem
        index={RecipientFieldType.Address}
        isVisible={isVisible}
        onSelectItem={onSelectItem}
      />
      <RecipientSelectItem
        index={RecipientFieldType.BnsName}
        isVisible={isVisible}
        onSelectItem={onSelectItem}
      />
    </RecipientSelectLayout>
  );
}
