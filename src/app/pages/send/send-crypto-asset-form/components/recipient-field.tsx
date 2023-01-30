import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

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
      dataTestId={SendCryptoAssetSelectors.RecipientFieldInput}
      label="To"
      labelAction="Choose account"
      name="recipientAddressOrBnsName"
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      placeholder="Address or name"
      topInputOverlay={topInputOverlay}
    />
  );
}
