import { useEffect } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField, useFormikContext } from 'formik';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { TextInputField } from '@app/components/text-input-field';

interface RecipientFieldProps {
  isDisabled?: boolean;
  label?: string;
  labelAction?: string;
  name: string;
  onBlur?(): void;
  onClickLabelAction?(): void;
  placeholder: string;
  topInputOverlay?: React.JSX.Element;
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
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext<BitcoinSendFormValues | StacksSendFormValues>();

  useEffect(() => {
    void setFieldValue(name, field.value.trim());
  }, [name, field.value, setFieldValue]);

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
