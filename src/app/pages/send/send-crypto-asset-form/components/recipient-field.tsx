import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

interface RecipientFieldProps {
  labelAction: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  labelAction,
  name,
  onBlur,
  onClickLabelAction,
  topInputOverlay,
}: RecipientFieldProps) {
  return (
    <TextInputField
      dataTestId={SendCryptoAssetSelectors.RecipientFieldInput}
      label="To"
      labelAction={labelAction}
      name={name}
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      placeholder="Address or name"
      topInputOverlay={topInputOverlay}
    />
  );
}
