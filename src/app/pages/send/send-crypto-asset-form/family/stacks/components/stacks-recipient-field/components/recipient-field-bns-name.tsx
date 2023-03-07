import { useEffect, useState } from 'react';

import { useFormikContext } from 'formik';

import { StacksSendFormValues } from '@shared/models/form.model';

import { RecipientField } from '@app/pages/send/send-crypto-asset-form/components/recipient-field';

import { useStacksRecipientBnsName } from '../hooks/use-stacks-recipient-bns-name';
import { RecipientBnsAddressDisplayer } from './recipient-bns-address-displayer';

interface RecipientFieldBnsNameProps {
  isSelectVisible: boolean;
  onClickLabelAction(): void;
  selectedRecipientField: number;
  topInputOverlay: JSX.Element;
}
export function RecipientFieldBnsName({
  isSelectVisible,
  onClickLabelAction,
  topInputOverlay,
}: RecipientFieldBnsNameProps) {
  const [showBnsAddress, setShowBnsAddress] = useState(false);
  const { errors, setFieldError, values } = useFormikContext<StacksSendFormValues>();
  const { bnsAddress, getBnsAddressAndValidate } = useStacksRecipientBnsName();

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
      <RecipientField
        isDisabled={isSelectVisible}
        labelAction="Select account"
        name="recipientBnsName"
        onBlur={getBnsAddressAndValidate}
        onClickLabelAction={onClickLabelAction}
        placeholder="Enter recipient BNS name"
        topInputOverlay={topInputOverlay}
      />
      {showBnsAddress ? <RecipientBnsAddressDisplayer address={bnsAddress} /> : null}
    </>
  );
}
