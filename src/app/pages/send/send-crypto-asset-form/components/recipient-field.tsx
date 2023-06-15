import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';

import { TextInputField } from '@app/components/text-input-field';

interface RecipientFieldProps {
  isDisabled?: boolean;
  label?: string;
  labelAction?: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder: string;
  topInputOverlay?: JSX.Element;
}
export function RecipientField({
  isDisabled,
  label,
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
      label={label}
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
