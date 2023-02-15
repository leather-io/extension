import { useCallback, useState } from 'react';

import { useField } from 'formik';

import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

export function useStacksRecipientBnsName() {
  const [, _, recipientFieldHelpers] = useField('recipient');
  const [recipientAddressOrBnsNameField] = useField('recipientAddressOrBnsName');
  const [bnsAddress, setBnsAddress] = useState('');
  const client = useStacksClientUnanchored();
  const { isTestnet } = useCurrentNetworkState();

  const getBnsAddress = useCallback(async () => {
    setBnsAddress('');
    try {
      const owner = await fetchNameOwner(
        client,
        recipientAddressOrBnsNameField.value ?? '',
        isTestnet
      );
      if (owner) {
        recipientFieldHelpers.setValue(owner);
        setBnsAddress(owner);
      } else {
        recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
      }
      return;
    } catch {
      recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
    }
  }, [recipientAddressOrBnsNameField.value, recipientFieldHelpers, isTestnet, client]);

  return { getBnsAddress, bnsAddress };
}
