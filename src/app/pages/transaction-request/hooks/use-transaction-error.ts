import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { microStxToStx, validateStacksAddress } from '@app/common/stacks-utils';
import { TransactionErrorReason } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { useContractInterface } from '@app/query/contract/contract.hooks';
import { TransactionTypes } from '@stacks/connect';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { useCurrentAccountAvailableStxBalance } from '@app/query/balance/balance.hooks';

import {
  useTransactionBroadcastError,
  useTransactionRequestState,
} from '@app/store/transactions/requests.hooks';
import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';

export function useTransactionError() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest);
  const broadcastError = useTransactionBroadcastError();

  const { origin } = useDefaultRequestParams();

  const currentAccount = useCurrentAccount();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  return useMemo<TransactionErrorReason | void>(() => {
    if (!origin) return TransactionErrorReason.ExpiredRequest;

    if (!transactionRequest || !availableStxBalance || !currentAccount) {
      return TransactionErrorReason.Generic;
    }

    if (transactionRequest.txType === TransactionTypes.ContractCall) {
      if (!validateStacksAddress(transactionRequest.contractAddress))
        return TransactionErrorReason.InvalidContractAddress;
      if (contractInterface.isError) return TransactionErrorReason.NoContract;
    }

    if (broadcastError) return TransactionErrorReason.BroadcastError;

    if (availableStxBalance) {
      const zeroBalance = availableStxBalance.toNumber() === 0;

      if (transactionRequest.txType === TransactionTypes.STXTransfer) {
        if (zeroBalance) return TransactionErrorReason.StxTransferInsufficientFunds;

        const transferAmount = new BigNumber(transactionRequest.amount);
        if (transferAmount.gte(availableStxBalance))
          return TransactionErrorReason.StxTransferInsufficientFunds;
      }

      if (!transactionRequest.sponsored) {
        if (zeroBalance) return TransactionErrorReason.FeeInsufficientFunds;

        if (transactionRequest.fee) {
          const feeValue = microStxToStx(transactionRequest.fee);
          if (feeValue.gte(availableStxBalance)) return TransactionErrorReason.FeeInsufficientFunds;
        }
      }
    }
    return;
  }, [
    broadcastError,
    contractInterface,
    availableStxBalance,
    currentAccount,
    transactionRequest,
    origin,
  ]);
}
