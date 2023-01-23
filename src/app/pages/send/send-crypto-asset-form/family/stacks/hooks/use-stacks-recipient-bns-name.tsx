import { useCallback, useState } from 'react';

import { useField } from 'formik';

import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

export function useStacksRecipientBnsName() {
  const [, _, recipientFieldHelpers] = useField('recipient');
  const [recipientAddressOrBnsNameField] = useField('recipientAddressOrBnsName');
  const [bnsAddress, setBnsAddress] = useState('');
  const client = useStacksClientUnanchored();

  const getBnsAddress = useCallback(async () => {
    setBnsAddress('');
    try {
      const res = await client.namesApi.getNameInfo({
        name: recipientAddressOrBnsNameField.value ?? '',
      });
      if (res.address) {
        recipientFieldHelpers.setValue(res.address);
        setBnsAddress(res.address);
      } else {
        recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
      }
      return;
    } catch {
      recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
    }
  }, [client.namesApi, recipientAddressOrBnsNameField.value, recipientFieldHelpers]);

  return { getBnsAddress, bnsAddress };
}
