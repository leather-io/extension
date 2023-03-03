import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useField } from 'formik';

import { RouteUrls } from '@shared/route-urls';

import { fetchBtcNameOwner } from '@app/query/stacks/bns/bns.utils';
import { useStacksClientUnanchored } from '@app/store/common/api-clients.hooks';

import { RecipientField } from '../../../components/recipient-field';
import { RecipientFieldBnsAddress } from '../../../family/stacks/components/recipient-field-bns-address';

export function BtcRecipientField() {
  const client = useStacksClientUnanchored();
  const [recipientAddressOrBnsField] = useField('recipientOrBnsName');
  const [, _, recipientFieldHelpers] = useField('recipient');
  const navigate = useNavigate();
  const [bnsAddress, setBnsAddress] = useState('');
  const [lastValidatedInput, setLastValidatedInput] = useState('');

  const getBtcAddressFromBns = useCallback(async () => {
    // Skip if this input was already handled
    if (lastValidatedInput === recipientAddressOrBnsField.value) return;

    setBnsAddress('');
    setLastValidatedInput(recipientAddressOrBnsField.value);
    try {
      const btcFromBns = await fetchBtcNameOwner(client, recipientAddressOrBnsField.value);
      if (btcFromBns) {
        recipientFieldHelpers.setValue(btcFromBns);
        setBnsAddress(btcFromBns);
      } else {
        recipientFieldHelpers.setValue(recipientAddressOrBnsField.value);
      }
    } catch (error) {
      recipientFieldHelpers.setValue(recipientAddressOrBnsField.value);
    }
  }, [
    client,
    recipientAddressOrBnsField,
    recipientFieldHelpers,
    lastValidatedInput,
    setLastValidatedInput,
  ]);

  return (
    <RecipientField
      labelAction="Choose account"
      lastChild
      name="recipientOrBnsName"
      onBlur={getBtcAddressFromBns}
      onClickLabelAction={() => navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts)}
      placeholder="Address"
      topInputOverlay={
        !!bnsAddress ? <RecipientFieldBnsAddress bnsAddress={bnsAddress} /> : undefined
      }
    />
  );
}
