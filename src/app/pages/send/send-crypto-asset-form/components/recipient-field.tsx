import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

interface RecipientFieldProps {
  labelAction?: string;
  lastChild?: boolean;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder: string;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  labelAction,
  lastChild,
  name,
  onBlur,
  onClickLabelAction,
  placeholder,
  topInputOverlay,
}: RecipientFieldProps) {
  return (
    <TextInputField
      dataTestId={SendCryptoAssetSelectors.RecipientFieldInput}
      label="To"
      labelAction={labelAction}
      lastChild={lastChild}
      name={name}
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      placeholder={placeholder}
      topInputOverlay={topInputOverlay}
    />
  );
}
