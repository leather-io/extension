import { useMemo } from 'react';
import BigNumber from 'bignumber.js';

import { microStxToStx, validateStacksAddress } from '@app/common/stacks-utils';
import { TransactionErrorReason } from '@app/pages/transaction-request/components/transaction-error/transaction-error';
import { useContractInterface } from '@app/query/contract/contract.hooks';
import { TransactionTypes } from '@stacks/connect';
import {
  useCurrentAccount,
  useCurrentAccountAvailableStxBalance,
} from '@app/store/accounts/account.hooks';

import { useTransactionRequestOrigin } from '@app/store/transactions/requests.hooks';
import {
  useTransactionBroadcastError,
  useTransactionRequestState,
} from '@app/store/transactions/requests.hooks';

import { useTransactionValidator } from './use-transaction-validator';

export function useTransactionError() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest);
  const broadcastError = useTransactionBroadcastError();

  const txValidationResult = useTransactionValidator();

  const origin = useTransactionRequestOrigin();

  const currentAccount = useCurrentAccount();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  return useMemo<TransactionErrorReason | void>(() => {
    // console.log({ transactionRequest, availableStxBalance, currentAccount });

    if (origin === false) return TransactionErrorReason.ExpiredRequest;

    if (!txValidationResult.isValid) return TransactionErrorReason.Unauthorized;

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
    origin,
    txValidationResult.isValid,
    transactionRequest,
    availableStxBalance,
    currentAccount,
  ]);
}
