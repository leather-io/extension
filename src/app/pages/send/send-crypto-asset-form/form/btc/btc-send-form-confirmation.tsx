import { useLocation, useNavigate } from 'react-router-dom';

import get from 'lodash.get';

import { logger } from '@shared/logger';
import { RouteUrls } from '@shared/route-urls';

import { ConfirmationButton } from '../../components/confirmation/components/confirmation-button';
import { useBitcoinBroadcastTransaction } from '../../family/bitcoin/hooks/use-bitcoin-broadcast-transaction';
import { BtcSendFormConfirmationDetails } from './btc-send-form-confirmation-details';

export function BtcSendFormConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tx = get(location.state, 'tx');
  const recipient = get(location.state, 'recipient');

  const { bitcoinDeserializedRawTransaction, bitcoinBroadcastTransaction } =
    useBitcoinBroadcastTransaction(tx);

  return (
    <>
      <BtcSendFormConfirmationDetails
        unsignedTx={bitcoinDeserializedRawTransaction}
        recipient={recipient}
      />
      <ConfirmationButton
        onClick={async () => {
          const result = await bitcoinBroadcastTransaction();
          logger.info(result);
          navigate(RouteUrls.Home);
        }}
      />
    </>
  );
}
