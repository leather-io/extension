import { RecipientTypeDropdown } from '@app/pages/send/send-crypto-asset-form/components/recipient-type-dropdown/recipient-type-dropdown';

interface RecipientDropdownOverlayProps {
  isSelectVisible: boolean;
  onSelectRecipientFieldType(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedRecipientField: number;
}
export function RecipientDropdownOverlay({
  isSelectVisible,
  onSelectRecipientFieldType,
  onSetIsSelectVisible,
  selectedRecipientField,
}: RecipientDropdownOverlayProps) {
  return (
    <RecipientTypeDropdown
      isVisible={isSelectVisible}
      onSelectItem={onSelectRecipientFieldType}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedItem={selectedRecipientField}
    />
  );
}
