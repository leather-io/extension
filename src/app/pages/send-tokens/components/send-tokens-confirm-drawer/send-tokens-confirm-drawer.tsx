import { useFormikContext } from 'formik';
import { Stack } from '@stacks/ui';
import BigNumber from 'bignumber.js';

import { useDrawers } from '@app/common/hooks/use-drawers';
import { BaseDrawer, BaseDrawerProps } from '@app/components/drawer/base-drawer';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';
import { TransactionFee } from '@app/components/fee-row/components/transaction-fee';
import { useSendFormUnsignedTxPreviewState } from '@app/store/transactions/transaction.hooks';

import { SendTokensConfirmActions } from './send-tokens-confirm-actions';
import { useEffect, useMemo } from 'react';
import { SendTokensConfirmDetails } from './send-tokens-confirm-details';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { SendFormValues } from '@app/common/transactions/transaction-utils';
import { StacksTransaction } from '@stacks/transactions';
import { useConvertStxToFiatAmount } from '@app/common/hooks/use-convert-to-fiat-amount';
import { createMoney } from '@shared/models/money.model';
import { microStxToStx } from '@app/common/stacks-utils';

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
  const { showEditNonce } = useDrawers();

  const convertStxToUsd = useConvertStxToFiatAmount();

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
      pauseOnClickOutside={showEditNonce}
    >
      <Stack pb="extra-loose" px="loose" spacing="base">
        <SendTokensConfirmDetails
          amount={values.amount}
          assetId={values.assetId}
          recipient={values.recipient}
        />
        <SpaceBetween>
          <Caption>Fees</Caption>
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
