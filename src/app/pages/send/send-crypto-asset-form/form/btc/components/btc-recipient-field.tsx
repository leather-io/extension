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
  const [recipientAddressOrBnsNameField] = useField('recipientAddressOrBnsName');
  const [, _, recipientFieldHelpers] = useField('recipient');
  const navigate = useNavigate();
  const [bnsAddress, setBnsAddress] = useState('');
  const [lastValidatedInput, setLastValidatedInput] = useState('');

  const getBtcAddressFromBns = useCallback(async () => {
    // Skip if this input was already handled
    if (lastValidatedInput === recipientAddressOrBnsNameField.value) return;

    setBnsAddress('');
    setLastValidatedInput(recipientAddressOrBnsNameField.value);
    try {
      const btcFromBns = await fetchBtcNameOwner(client, recipientAddressOrBnsNameField.value);
      if (btcFromBns) {
        recipientFieldHelpers.setValue(btcFromBns);
        setBnsAddress(btcFromBns);
      } else {
        recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
      }
    } catch (error) {
      recipientFieldHelpers.setValue(recipientAddressOrBnsNameField.value);
    }
  }, [
    client,
    recipientAddressOrBnsNameField,
    recipientFieldHelpers,
    lastValidatedInput,
    setLastValidatedInput,
  ]);

  const onClickLabel = () => {
    setBnsAddress('');
    navigate(RouteUrls.SendCryptoAssetFormRecipientAccounts);
  };

  return (
    <RecipientField
      labelAction="Choose account"
      lastChild
      name="recipientAddressOrBnsName"
      onBlur={getBtcAddressFromBns}
      onClickLabelAction={onClickLabel}
      placeholder="Address"
      topInputOverlay={
        !!bnsAddress ? <RecipientFieldBnsAddress bnsAddress={bnsAddress} /> : undefined
      }
    />
  );
}
