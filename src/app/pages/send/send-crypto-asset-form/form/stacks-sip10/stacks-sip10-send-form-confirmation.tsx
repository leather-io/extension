import { useLocation, useParams } from 'react-router-dom';

import { cvToString } from '@stacks/transactions';
import get from 'lodash.get';

import { logger } from '@shared/logger';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { Header } from '@app/components/header';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../../components/confirmation/components/confirmation-info-label';
import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { useSendFormNavigate } from '../../hooks/use-send-form-navigate';
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
    <>
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
    </>
  );
}
