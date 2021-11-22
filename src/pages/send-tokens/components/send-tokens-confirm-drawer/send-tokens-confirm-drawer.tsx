import React, { useCallback } from 'react';
import { Flex, Stack } from '@stacks/ui';

import { useDrawers } from '@common/hooks/use-drawers';
import { BaseDrawer, BaseDrawerProps } from '@components/drawer';
import { LoadingKeys } from '@common/hooks/use-loading';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { TransactionFee } from '@features/fee-row/components/transaction-fee';
import { useHandleSubmitTransaction } from '@common/hooks/use-submit-stx-transaction';
import {
  useLocalTransactionInputsState,
  useTxForSettingsState,
} from '@store/transactions/transaction.hooks';
import {
  useFeeEstimationsState,
  useFeeRateState,
  useFeeState,
} from '@store/transactions/fees.hooks';

import { SendTokensConfirmActions } from './send-tokens-confirm-actions';
import { SendTokensConfirmDetails } from './send-tokens-confirm-details';

export function SendTokensConfirmDrawer(props: BaseDrawerProps) {
  const { isShowing, onClose } = props;
  const [txData] = useLocalTransactionInputsState();
  const [transaction] = useTxForSettingsState();
  const { showEditNonce } = useDrawers();
  const [, setFeeEstimations] = useFeeEstimationsState();
  const [, setFee] = useFeeState();
  const [, setFeeRate] = useFeeRateState();

  const handleBroadcastTransaction = useHandleSubmitTransaction({
    transaction: transaction || null,
    onClose,
    loadingKey: LoadingKeys.CONFIRM_DRAWER,
  });

  const broadcastTransaction = useCallback(async () => {
    await handleBroadcastTransaction();
    setFeeEstimations([]);
    setFee(null);
    setFeeRate(null);
  }, [handleBroadcastTransaction, setFee, setFeeEstimations, setFeeRate]);

  if (!transaction || !txData || !isShowing) return null;

  return (
    <BaseDrawer
      title="Confirm transfer"
      isShowing={isShowing}
      onClose={onClose}
      pauseOnClickOutside={showEditNonce}
    >
      <Stack pb="extra-loose" px="loose" spacing="loose">
        <SendTokensConfirmDetails
          amount={txData.amount}
          recipient={txData.recipient}
          nonce={transaction?.auth.spendingCondition?.nonce.toNumber()}
        />
        <SpaceBetween>
          <Caption>
            <Flex>Fees</Flex>
          </Caption>
          <Caption>
            <TransactionFee />
          </Caption>
        </SpaceBetween>
        <SendTokensConfirmActions onSubmit={broadcastTransaction} transaction={transaction} />
      </Stack>
    </BaseDrawer>
  );
}
