import { TextInputField } from './text-input-field';

interface RecipientFieldProps {
  onBlur?(): void;
  onClickLabelAction?(): void;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  onBlur,
  onClickLabelAction,
  topInputOverlay,
}: RecipientFieldProps) {
  return (
    <TextInputField
      name="recipientAddressOrBnsName"
      label="To"
      labelAction="Choose account"
      placeholder="Address or name"
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      topInputOverlay={topInputOverlay}
    />
  );
}
