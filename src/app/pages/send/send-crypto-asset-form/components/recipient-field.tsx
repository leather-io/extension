import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from './text-input-field';

interface RecipientFieldProps {
  isDisabled?: boolean;
  labelAction?: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder: string;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  isDisabled,
  labelAction,
  name,
  onBlur,
  onClickLabelAction,
  placeholder,
  topInputOverlay,
}: RecipientFieldProps) {
  return (
    <TextInputField
      dataTestId={SendCryptoAssetSelectors.RecipientFieldInput}
      isDisabled={isDisabled}
      labelAction={labelAction}
      minHeight="76px"
      name={name}
      onBlur={onBlur}
      onClickLabelAction={onClickLabelAction}
      placeholder={placeholder}
      topInputOverlay={topInputOverlay}
    />
  );
}
