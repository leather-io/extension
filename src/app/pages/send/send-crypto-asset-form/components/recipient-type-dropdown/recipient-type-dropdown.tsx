import { RecipientDropdownItem } from './components/recipient-dropdown-item';
import { RecipientDropdownLayout } from './components/recipient-dropdown.layout';

export enum RecipientFieldType {
  Address,
  BnsName,
}

interface RecipientTypeDropdownProps {
  isVisible: boolean;
  onSelectItem(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedItem: number;
}
export function RecipientTypeDropdown(props: RecipientTypeDropdownProps) {
  const { isVisible, onSelectItem, onSetIsSelectVisible, selectedItem } = props;

  return (
    <RecipientDropdownLayout
      isVisible={isVisible}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedItem={selectedItem}
    >
      <RecipientDropdownItem
        index={RecipientFieldType.Address}
        isVisible={isVisible}
        onSelectItem={onSelectItem}
      />
      <RecipientDropdownItem
        index={RecipientFieldType.BnsName}
        isVisible={isVisible}
        onSelectItem={onSelectItem}
      />
    </RecipientDropdownLayout>
  );
}
