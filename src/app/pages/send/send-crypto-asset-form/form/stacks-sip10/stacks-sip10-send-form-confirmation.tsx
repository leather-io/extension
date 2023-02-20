import { useLocation, useParams } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../../components/confirmation/components/confirmation-info-label';
import { SendFormConfirmationLayout } from '../../components/confirmation/components/send-form-confirmation.layout';
import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { StacksSip10SendFormConfirmationDetails } from './stacks-sip10-send-form-confirmation-details';

export function StacksSip10SendFormConfirmation() {
  const location = useLocation();
  const { symbol } = useParams();

  const tx = get(location.state, 'tx');

  const { stacksDeserializedTransaction, stacksBroadcastTransaction } =
    useStacksBroadcastTransaction(tx);

  if (!symbol) {
    logger.error('Cannot confirm token symbol');
    return null;
  }

  return (
    <SendFormConfirmationLayout>
      <StacksSip10SendFormConfirmationDetails
        decimals={get(location.state, 'decimals')}
        symbol={symbol}
        token={get(location.state, 'token')}
        unsignedTx={stacksDeserializedTransaction}
      />
      <ConfirmationInfoLabel symbol={symbol} />
      <ConfirmationButton
        onClick={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
      />
    </SendFormConfirmationLayout>
  );
}
