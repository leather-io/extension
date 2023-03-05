import { useCallback, useState } from 'react';

import { useFormikContext } from 'formik';

import { StacksSendFormValues } from '@shared/models/form.model';

import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useStacksRecipientBnsName() {
  const { setFieldValue, validateField, values } = useFormikContext<StacksSendFormValues>();
  const [bnsAddress, setBnsAddress] = useState('');
  const client = useStacksClientUnanchored();
  const { isTestnet } = useCurrentNetworkState();

  const getBnsAddress = useCallback(async () => {
    setBnsAddress('');
    if (values.recipientAddressOrBnsName.includes('.')) {
      try {
        const owner = await fetchNameOwner(
          client,
          values.recipientAddressOrBnsName ?? '',
          isTestnet
        );
        if (owner) {
          setBnsAddress(owner);
          setFieldValue('resolvedRecipient', owner);
          // Only validate if the address is found/set
          validateField('resolvedRecipient');
        }
      } catch (e) {}
    }
  }, [values.recipientAddressOrBnsName, client, isTestnet, setFieldValue, validateField]);

  return { bnsAddress, getBnsAddress, setBnsAddress };
}
