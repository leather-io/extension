import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../../components/confirmation/components/confirmation-info-label';
import { SendFormConfirmationLayout } from '../../components/confirmation/components/send-form-confirmation.layout';
import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { StxSendFormConfirmationDetails } from './stx-send-form-confirmation-details';

export function StxSendFormConfirmation() {
  const location = useLocation();

  const tx = get(location.state, 'tx');

  const { stacksDeserializedTransaction, stacksBroadcastTransaction } =
    useStacksBroadcastTransaction(tx);

  return (
    <SendFormConfirmationLayout>
      <StxSendFormConfirmationDetails unsignedTx={stacksDeserializedTransaction} />
      <ConfirmationInfoLabel symbol="stx" />
      <ConfirmationButton
        onClick={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
      />
    </SendFormConfirmationLayout>
  );
}
