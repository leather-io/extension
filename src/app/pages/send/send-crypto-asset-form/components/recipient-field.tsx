import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

interface RecipientFieldProps {
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  name,
  onBlur,
  onClickLabelAction,
  topInputOverlay,
}: RecipientFieldProps) {
  return (
    <TextInputField
      dataTestId={SendCryptoAssetSelectors.RecipientFieldInput}
      label="To"
      labelAction="Choose account"
      name={name}
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      placeholder="Address or name"
      topInputOverlay={topInputOverlay}
    />
  );
}
