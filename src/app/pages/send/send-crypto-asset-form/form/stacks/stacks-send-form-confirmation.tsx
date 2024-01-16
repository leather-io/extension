import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';

import { CryptoCurrencies } from '@shared/models/currencies.model';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { ModalHeader } from '@app/components/modal-header';
import { InfoIcon } from '@app/ui/components/icons/info-icon';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

import { useStacksBroadcastTransaction } from '../../family/stacks/hooks/use-stacks-broadcast-transaction';
import { useStacksTransactionSummary } from '../../family/stacks/hooks/use-stacks-transaction-summary';
import { SendFormConfirmation } from '../send-form-confirmation';

function useStacksSendFormConfirmationState() {
  return {
    tx: useLocationStateWithCache('tx') as string,
    decimals: useLocationStateWithCache('decimals') as number,
    showFeeChangeWarning: useLocationStateWithCache('showFeeChangeWarning') as boolean,
  };
}

export function StacksSendFormConfirmation() {
  const { tx, decimals, showFeeChangeWarning } = useStacksSendFormConfirmationState();
  const { symbol = 'STX' } = useParams();
  const navigate = useNavigate();

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

  useRouteHeader(
    <ModalHeader
      hideActions
      defaultClose
      onGoBack={() => navigate('../', { relative: 'path', replace: true })}
      title="Review"
    />
  );

  const feeWarningTooltip = showFeeChangeWarning ? (
    <BasicTooltip
      label={
        'You are using a nonce for this transaction that is already pending. The fee has been increased so that it is exactly high enough to replace the pending transaction with the same nonce.'
      }
      side="bottom"
    >
      <Stack>
        <Box>
          <InfoIcon color="accent.text-subdued" />
        </Box>
      </Stack>
    </BasicTooltip>
  ) : null;

  return (
    <>
      <Outlet />
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
    </>
  );
}
