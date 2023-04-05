import { RecipientSelect } from '@app/pages/send/send-crypto-asset-form/components/recipient-select/recipient-select';

interface RecipientSelectOverlayProps {
  isSelectVisible: boolean;
  onSelectRecipientFieldType(index: number): void;
  onSetIsSelectVisible(value: boolean): void;
  selectedRecipientField: number;
}
export function RecipientSelectOverlay({
  isSelectVisible,
  onSelectRecipientFieldType,
  onSetIsSelectVisible,
  selectedRecipientField,
}: RecipientSelectOverlayProps) {
  return (
    <RecipientSelect
      isVisible={isSelectVisible}
      onSelectItem={onSelectRecipientFieldType}
      onSetIsSelectVisible={onSetIsSelectVisible}
      selectedItem={selectedRecipientField}
    />
  );
}
