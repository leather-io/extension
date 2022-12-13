import { useEffect, useMemo } from 'react';

import { StacksTransaction } from '@stacks/transactions';
import { Stack } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import { SendFormValues } from '@shared/models/form.model';
import { createMoney } from '@shared/models/money.model';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useConvertCryptoCurrencyToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { microStxToStx } from '@app/common/money/unit-conversion';
import { BaseDrawer, BaseDrawerProps } from '@app/components/drawer/base-drawer';
import { TransactionFee } from '@app/components/fee-row/components/transaction-fee';
import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { useSendFormUnsignedTxPreviewState } from '@app/store/transactions/transaction.hooks';

import { SendTokensConfirmActions } from './send-tokens-confirm-actions';
import { SendTokensConfirmDetails } from './send-tokens-confirm-details';

function getFeeWithDefaultOfZero(tx?: StacksTransaction) {
  if (!tx) return createMoney(0, 'STX');
  const fee = microStxToStx(Number(tx.auth.spendingCondition.fee));
  return createMoney(new BigNumber(fee), 'STX');
}

interface SendTokensSoftwareConfirmDrawerProps extends BaseDrawerProps {
  onUserSelectBroadcastTransaction(tx: StacksTransaction | undefined): void;
}
export function SendTokensSoftwareConfirmDrawer(props: SendTokensSoftwareConfirmDrawerProps) {
  const { isShowing, onClose, onUserSelectBroadcastTransaction } = props;
  const { values } = useFormikContext<SendFormValues>();
  const unsignedTransaction = useSendFormUnsignedTxPreviewState(values.assetId, values);
  const analytics = useAnalytics();
  const { isShowingEditNonce } = useDrawers();

  const convertStxToUsd = useConvertCryptoCurrencyToFiatAmount('STX');

  const feeInUsd = useMemo(
    () => convertStxToUsd(getFeeWithDefaultOfZero(unsignedTransaction)),
    [convertStxToUsd, unsignedTransaction]
  );

  useEffect(() => {
    if (!isShowing) return;
    void analytics.track('view_transaction_signing');
  }, [isShowing, analytics]);

  if (!isShowing || !unsignedTransaction || !values) return null;

  return (
    <BaseDrawer
      title="Confirm transfer"
      isShowing={isShowing}
      onClose={onClose}
      pauseOnClickOutside={isShowingEditNonce}
    >
      <Stack pb="extra-loose" px="loose" spacing="base">
        <SendTokensConfirmDetails
          amount={values.amount}
          assetId={values.assetId}
          recipient={values.recipient}
        />
        <SpaceBetween>
          <Caption>Fee</Caption>
          <Caption>
            <TransactionFee
              fee={getFeeWithDefaultOfZero(unsignedTransaction).amount.toString()}
              usdAmount={feeInUsd}
            />
          </Caption>
        </SpaceBetween>
        <SpaceBetween>
          <Caption>Nonce</Caption>
          <Caption>{Number(unsignedTransaction.auth.spendingCondition.nonce)}</Caption>
        </SpaceBetween>
        <SendTokensConfirmActions
          transaction={unsignedTransaction}
          onUserConfirmBroadcast={() => onUserSelectBroadcastTransaction(unsignedTransaction)}
        />
      </Stack>
    </BaseDrawer>
  );
}
