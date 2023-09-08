import { FiInfo } from 'react-icons/fi';
import { useLocation, useParams } from 'react-router-dom';

// #4164 FIXME replace with radix tooltip
import { Tooltip } from '@stacks/ui';
import { Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';
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
    showFeeChangeWarning: get(location.state, 'showFeeChangeWarning') as boolean,
  };
}

export function StacksSendFormConfirmation() {
  const { tx, decimals, showFeeChangeWarning } = useStacksSendFormConfirmationState();
  const { symbol = 'STX' } = useParams();

  const { stacksDeserializedTransaction, stacksBroadcastTransaction, isBroadcasting } =
    useStacksBroadcastTransaction(tx, symbol.toUpperCase() as CryptoCurrencies, decimals);

  const { formReviewTxSummary } = useStacksTransactionSummary(
    symbol.toUpperCase() as CryptoCurrencies
  );
  const {
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    recipient,
    fee,
    totalSpend,
    sendingValue,
    arrivesIn,
    nonce,
    memoDisplayText,
  } = formReviewTxSummary(stacksDeserializedTransaction, symbol, decimals);

  useRouteHeader(<ModalHeader hideActions defaultClose defaultGoBack title="Review" />);

  const feeWarningTooltip = showFeeChangeWarning ? (
    <Tooltip
      label={
        'You are using a nonce for this transaction that is already pending. The fee has been increased so that it is exactly high enough to replace the pending transaction with the same nonce.'
      }
      placement="bottom"
    >
      <Stack>
        <FiInfo
          color={token('colors.accent.text-subdued')}
          size="14px"
          style={{ marginLeft: token('spacing.-space.01') }}
        />
      </Stack>
    </Tooltip>
  ) : null;

  return (
    <SendFormConfirmation
      txValue={txValue}
      txFiatValue={txFiatValue}
      txFiatValueSymbol={txFiatValueSymbol}
      recipient={recipient}
      fee={fee}
      totalSpend={totalSpend}
      sendingValue={sendingValue}
      arrivesIn={arrivesIn}
      nonce={nonce}
      memoDisplayText={memoDisplayText}
      symbol={symbol.toUpperCase()}
      isLoading={isBroadcasting}
      feeWarningTooltip={feeWarningTooltip}
      onBroadcastTransaction={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
    />
  );
}
