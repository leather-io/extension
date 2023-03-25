import { useLocation, useParams } from 'react-router-dom';

import get from 'lodash.get';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';

import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { useStacksTransactionSummary } from '../../family/stacks/hooks/use-stacks-transaction-summary';
import { SendFormConfirmation } from '../send-form-confirmation';

function useStacksSendFormConfirmationState() {
  const location = useLocation();
  return {
    tx: get(location.state, 'tx') as string,
    decimals: get(location.state, 'decimals') as number,
  };
}

export function StacksSendFormConfirmation() {
  const { tx, decimals } = useStacksSendFormConfirmationState();
  const { symbol = 'STX' } = useParams();

  const { stacksDeserializedTransaction, stacksBroadcastTransaction, isBroadcasting } =
    useStacksBroadcastTransaction(tx, symbol.toUpperCase() as CryptoCurrencies);

  const { formReviewTxSummary } = useStacksTransactionSummary(
    symbol.toUpperCase() as CryptoCurrencies
  );
  const {
    txValue,
    txFiatValue,
    recipient,
    fee,
    totalSpend,
    sendingValue,
    arrivesIn,
    nonce,
    memoDisplayText,
  } = formReviewTxSummary(stacksDeserializedTransaction, symbol, decimals);

  useRouteHeader(<ModalHeader hideActions defaultClose defaultGoBack title="Review" />);

  return (
    <SendFormConfirmation
      txValue={txValue}
      txFiatValue={txFiatValue}
      recipient={recipient}
      fee={fee}
      totalSpend={totalSpend}
      sendingValue={sendingValue}
      arrivesIn={arrivesIn}
      nonce={nonce}
      memoDisplayText={memoDisplayText}
      symbol={symbol.toUpperCase()}
      isLoading={isBroadcasting}
      onBroadcastTransaction={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
    />
  );
}
