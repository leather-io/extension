import { RecipientField } from '@app/pages/send/send-crypto-asset-form/components/recipient-field';

interface RecipientFieldAddressProps {
  isSelectVisible: boolean;
  onClickLabelAction(): void;
  selectedRecipientField: number;
  topInputOverlay: React.JSX.Element;
}
export function RecipientFieldAddress({
  isSelectVisible,
  onClickLabelAction,
  topInputOverlay,
}: RecipientFieldAddressProps) {
  return (
    <RecipientField
      isDisabled={isSelectVisible}
      labelAction="Select account"
      name="recipient"
      onClickLabelAction={onClickLabelAction}
      placeholder="Enter recipient address"
      topInputOverlay={topInputOverlay}
    />
  );
}
