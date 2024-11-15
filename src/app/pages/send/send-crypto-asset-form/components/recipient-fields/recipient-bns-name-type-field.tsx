import { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';

import type { BnsV2Client } from '@leather.io/query';

import { BitcoinSendFormValues, StacksSendFormValues } from '@shared/models/form.model';

import { RecipientAddressTypeField } from '@app/pages/send/send-crypto-asset-form/components/recipient-address-type-field';

import { RecipientAddressDisplayer } from './components/recipient-address-displayer';
import { useRecipientBnsName } from './hooks/use-recipient-bns-name';

interface RecipientBnsNameTypeFieldProps {
  fetchFn(client: BnsV2Client, name: string, isTestnet?: boolean): Promise<string | null>;
  topInputOverlay: React.JSX.Element;
  rightLabel: React.JSX.Element;
}
export function RecipientBnsNameTypeField({
  fetchFn,
  topInputOverlay,
  rightLabel,
}: RecipientBnsNameTypeFieldProps) {
  const [showBnsAddress, setShowBnsAddress] = useState(false);
  const { errors, setFieldError, values } = useFormikContext<
    BitcoinSendFormValues | StacksSendFormValues
  >();
  const { bnsAddress, getBnsAddressAndValidate } = useRecipientBnsName();

  // Apply the recipient field validation to the bns name field
  // here so we don't need to validate the bns name on blur.
  // Bns name validation occurs in the hook handling the lookup.
  // This allows us to have just one field handling the recipient
  // address for generating the unsigned transaction.
  useEffect(() => {
    if (!errors.recipient) {
      bnsAddress && setShowBnsAddress(true);
      setFieldError('recipientBnsName', undefined);
    }
    if (values.recipient && errors.recipient) {
      setShowBnsAddress(false);
      setFieldError('recipientBnsName', errors.recipient);
    }
  }, [bnsAddress, errors.recipient, setFieldError, values.recipient]);

  return (
    <>
      <RecipientAddressTypeField
        name="recipientBnsName"
        onBlur={() => getBnsAddressAndValidate(fetchFn)}
        placeholder="Enter recipient BNS name"
        topInputOverlay={topInputOverlay}
        rightLabel={rightLabel}
      />
      {showBnsAddress ? <RecipientAddressDisplayer address={bnsAddress} /> : null}
    </>
  );
}
