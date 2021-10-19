import React, { memo, useEffect } from 'react';

import { useNextTxNonce } from '@common/hooks/account/use-next-tx-nonce';
import { PopupContainer } from '@components/popup/container';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { NetworkRow } from '@components/network-row';
import { PopupHeader } from '@pages/transaction-signing/components/popup-header';
import { TransactionPageTop } from '@pages/transaction-signing/components/transaction-page-top';
import { ContractCallDetails } from '@pages/transaction-signing/components/details/contract-call-details';
import { ContractDeployDetails } from '@pages/transaction-signing/components/details/contract-deploy-details';
import { PostConditions } from '@pages/transaction-signing/components/post-conditions/post-conditions-list';
import { StxTransferDetails } from '@pages/transaction-signing/components/details/stx-transfer-details';
import { PostConditionModeWarning } from '@pages/transaction-signing/components/post-condition-mode-warning';
import { TransactionError } from '@pages/transaction-signing/components/errors/transaction-error';
import { FeeRow } from '@pages/transaction-signing/components/fee-row/fee-row';
import { MinimalErrorMessage } from '@pages/transaction-signing/components/minimal-error-message';
import { SubmitAction } from '@pages/transaction-signing/components/submit-action';
import { Stack } from '@stacks/ui';
import {
  useTransactionRequestState,
  useUpdateTransactionBroadcastError,
} from '@store/transactions/requests.hooks';

export const TransactionPage = memo(() => {
  useNextTxNonce();
  const transactionRequest = useTransactionRequestState();
  const setBroadcastError = useUpdateTransactionBroadcastError();

  useEffect(() => {
    return () => setBroadcastError(null);
  }, [setBroadcastError]);

  if (!transactionRequest) return null;

  return (
    <PopupContainer header={<PopupHeader />}>
      <Stack spacing="loose">
        <TransactionPageTop />
        <PostConditionModeWarning />
        <TransactionError />
        <PostConditions />
        {transactionRequest.txType === 'contract_call' && <ContractCallDetails />}
        {transactionRequest.txType === 'token_transfer' && <StxTransferDetails />}
        {transactionRequest.txType === 'smart_contract' && <ContractDeployDetails />}
        <FeeRow />
        <SpaceBetween>
          <Caption>Network</Caption>
          <NetworkRow />
        </SpaceBetween>
        <MinimalErrorMessage />
        <SubmitAction />
      </Stack>
    </PopupContainer>
  );
});
