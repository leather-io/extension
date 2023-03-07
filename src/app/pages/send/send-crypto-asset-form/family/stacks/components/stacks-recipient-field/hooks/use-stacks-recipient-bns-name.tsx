import { useCallback, useState } from 'react';

import { useFormikContext } from 'formik';

import { logger } from '@shared/logger';
import { StacksSendFormValues } from '@shared/models/form.model';

import { FormErrorMessages } from '@app/common/error-messages';
import { fetchNameOwner } from '@app/query/stacks/bns/bns.utils';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';
import { useCurrentNetworkState } from '@app/store/networks/networks.hooks';

// Handles validating the BNS name lookup
export function useStacksRecipientBnsName() {
  const { setFieldError, setFieldValue, values } = useFormikContext<StacksSendFormValues>();
  const [bnsAddress, setBnsAddress] = useState('');
  const currentNetwork = useCurrentNetworkState();
  const client = useStacksClientUnanchored();

  const getBnsAddressAndValidate = useCallback(async () => {
    setBnsAddress('');
    if (!values.recipientBnsName) return;

    try {
      const owner = await fetchNameOwner(client, values.recipientBnsName, currentNetwork.isTestnet);
      if (owner) {
        setBnsAddress(owner);
        setFieldError('recipient', undefined);
        setFieldValue('recipient', owner);
      } else {
        setFieldError('recipientBnsName', FormErrorMessages.BnsAddressNotFound);
      }
    } catch (e) {
      setFieldError('recipientBnsName', FormErrorMessages.BnsAddressNotFound);
      logger.error('Error fetching bns address', e);
    }
  }, [client, currentNetwork.isTestnet, setFieldError, setFieldValue, values.recipientBnsName]);

  return { bnsAddress, getBnsAddressAndValidate, setBnsAddress };
}
