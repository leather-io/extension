import { useEffect } from 'react';

import { SendCryptoAssetSelectors } from '@tests/selectors/send.selectors';
import { useField, useFormikContext } from 'formik';
import { Box } from 'leather-styles/jsx';

import { Input } from '@leather.io/ui';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

interface RecipientAddressTypeFieldProps {
  label?: string;
  name: string;
  onBlur?(): void;
  placeholder: string;
  topInputOverlay?: React.JSX.Element;
  rightLabel?: React.JSX.Element;
}
export function RecipientAddressTypeField({
  name,
  topInputOverlay,
  rightLabel,
  onBlur,
}: RecipientAddressTypeFieldProps) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext<BitcoinSendFormValues | StacksSendFormValues>();

  useEffect(() => {
    void setFieldValue(name, field.value.trim());
  }, [name, field.value, setFieldValue]);

  return (
    <Box width="100%" position="relative" mb="space.02">
      <Input.Root shrink>
        {rightLabel && (
          <Box pos="absolute" right="space.03" zIndex={15} top="9px">
            {rightLabel}
          </Box>
        )}
        {topInputOverlay && <Input.Label>{topInputOverlay}</Input.Label>}
        <Input.Field
          data-testid={SendCryptoAssetSelectors.RecipientFieldInput}
          placeholder="Recipient"
          {...field}
          onBlur={e => {
            field.onBlur(e);
            onBlur?.();
          }}
        />
      </Input.Root>
    </Box>
  );
}
