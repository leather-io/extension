import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../../components/confirmation/components/confirmation-info-label';
import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { StxSendFormConfirmationDetails } from './stx-send-form-confirmation-details';

export function StxSendFormConfirmation() {
  const location = useLocation();

  const tx = get(location.state, 'tx');

  const { stacksDeserializedTransaction, stacksBroadcastTransaction } =
    useStacksBroadcastTransaction(tx);

  return (
    <>
      <StxSendFormConfirmationDetails unsignedTx={stacksDeserializedTransaction} />
      <ConfirmationInfoLabel symbol="stx" />
      <ConfirmationButton
        onClick={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
      />
    </>
  );
}
