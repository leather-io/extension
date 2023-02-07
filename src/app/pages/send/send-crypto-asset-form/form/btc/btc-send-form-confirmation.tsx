import { useLocation } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { ConfirmationInfoLabel } from '../../components/confirmation/components/confirmation-info-label';
import { useBitcoinBroadcastTransaction } from '../../family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
import { BtcSendFormConfirmationDetails } from './btc-send-form-confirmation-details';

export function BtcSendFormConfirmation() {
  const location = useLocation();

  const tx = get(location.state, 'tx');

  logger.info('tx', tx);

  const { bitcoinDeserializedRawTransaction, bitcoinBroadcastTransaction } =
    useBitcoinBroadcastTransaction(tx);

  return (
    <>
      <BtcSendFormConfirmationDetails unsignedTx={bitcoinDeserializedRawTransaction} />
      <ConfirmationInfoLabel symbol="btc" />
      <ConfirmationButton onClick={() => bitcoinBroadcastTransaction()} />
    </>
  );
}
