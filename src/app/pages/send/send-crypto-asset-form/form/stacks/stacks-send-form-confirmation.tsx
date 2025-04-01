import { Outlet, useParams } from 'react-router-dom';

import { deserializeTransaction } from '@stacks/transactions';
import { Box, Stack } from 'leather-styles/jsx';

import type { CryptoCurrency } from '@leather.io/models';
import { InfoCircleIcon } from '@leather.io/ui';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { Content, Page } from '@app/components/layout';
import { PageHeader } from '@app/features/container/headers/page.header';
import { useStacksBroadcastTransaction } from '@app/features/stacks-transaction-request/hooks/use-stacks-broadcast-transaction';
import { useStacksTransactionSummary } from '@app/features/stacks-transaction-request/hooks/use-stacks-transaction-summary';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

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

  const { stacksBroadcastTransaction, isBroadcasting } = useStacksBroadcastTransaction({
    token: symbol.toUpperCase() as CryptoCurrency,
    decimals,
  });

  const stacksDeserializedTransaction = deserializeTransaction(tx);

  const { formReviewTxSummary } = useStacksTransactionSummary(
    symbol.toUpperCase() as CryptoCurrency
  );

  if (!formReviewTxSummary) return null;

  const {
    txValue,
    txFiatValue,
    txFiatValueSymbol,
    recipient,
    fee,
    totalSpend,
    sendingValue,
    nonce,
    memoDisplayText,
  } = formReviewTxSummary(stacksDeserializedTransaction, symbol, decimals);

  const feeWarningTooltip = showFeeChangeWarning ? (
    <BasicTooltip
      label={
        'You are using a nonce for this transaction that is already pending. The fee has been increased so that it is exactly high enough to replace the pending transaction with the same nonce.'
      }
      side="bottom"
    >
      <Stack>
        <Box>
          <InfoCircleIcon color="ink.text-subdued" variant="small" />
        </Box>
      </Stack>
    </BasicTooltip>
  ) : null;

  return (
    <>
      <PageHeader title="Review" />
      <Content>
        <Page>
          <Outlet />
          <SendFormConfirmation
            txValue={txValue}
            txFiatValue={txFiatValue}
            txFiatValueSymbol={txFiatValueSymbol}
            recipient={recipient}
            fee={fee}
            totalSpend={totalSpend}
            sendingValue={sendingValue}
            nonce={nonce}
            memoDisplayText={memoDisplayText}
            symbol={symbol.toUpperCase()}
            isLoading={isBroadcasting}
            feeWarningTooltip={feeWarningTooltip}
            onBroadcastTransaction={() => stacksBroadcastTransaction(stacksDeserializedTransaction)}
          />
        </Page>
      </Content>
    </>
  );
}
