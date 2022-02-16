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
import { useOrigin } from '@app/store/transactions/requests.hooks';
import {
  useTransactionBroadcastError,
  useTransactionRequestState,
  useTransactionRequestValidation,
} from '@app/store/transactions/requests.hooks';

import { useUnsignedTransactionFee } from './use-signed-transaction-fee';

export function useTransactionError() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest);
  const fee = useUnsignedTransactionFee();
  const broadcastError = useTransactionBroadcastError();
  const isValidTransaction = useTransactionRequestValidation();
  const origin = useOrigin();

  const currentAccount = useCurrentAccount();
  const availableStxBalance = useCurrentAccountAvailableStxBalance();

  return useMemo<TransactionErrorReason | void>(() => {
    if (origin === false) return TransactionErrorReason.ExpiredRequest;
    if (isValidTransaction === false) return TransactionErrorReason.Unauthorized;

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

      if (zeroBalance && !fee.isSponsored) return TransactionErrorReason.FeeInsufficientFunds;

      if (fee && !fee.isSponsored && fee.value) {
        const feeValue = microStxToStx(fee.value);
        if (feeValue.gte(availableStxBalance)) return TransactionErrorReason.FeeInsufficientFunds;
      }
    }
    return;
  }, [
    fee,
    broadcastError,
    contractInterface,
    availableStxBalance,
    currentAccount,
    transactionRequest,
    isValidTransaction,
    origin,
  ]);
}
