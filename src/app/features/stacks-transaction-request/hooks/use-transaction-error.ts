import { useMemo } from 'react';

import { ContractCallPayload, TransactionTypes } from '@stacks/connect';
import BigNumber from 'bignumber.js';
import { useFormikContext } from 'formik';

import { StacksTransactionFormValues } from '@shared/models/form.model';

import { useDefaultRequestParams } from '@app/common/hooks/use-default-request-search-params';
import { initialSearchParams } from '@app/common/initial-search-params';
import { stxToMicroStx } from '@app/common/money/unit-conversion';
import { validateStacksAddress } from '@app/common/stacks-utils';
import { TransactionErrorReason } from '@app/features/stacks-transaction-request/transaction-error/transaction-error';
import { useCurrentStacksAccountAnchoredBalances } from '@app/query/stacks/balance/stx-balance.hooks';
import { useContractInterface } from '@app/query/stacks/contract/contract.hooks';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { useTransactionRequestState } from '@app/store/transactions/requests.hooks';

function getIsMultisig() {
  return initialSearchParams.get('isMultisig') === 'true';
}

export function useTransactionError() {
  const transactionRequest = useTransactionRequestState();
  const contractInterface = useContractInterface(transactionRequest as ContractCallPayload);
  const { origin } = useDefaultRequestParams();
  const { values } = useFormikContext<StacksTransactionFormValues>();

  const currentAccount = useCurrentStacksAccount();
  const { data: balances } = useCurrentStacksAccountAnchoredBalances();

  return useMemo<TransactionErrorReason | void>(() => {
    if (!origin) return TransactionErrorReason.ExpiredRequest;

    if (!transactionRequest || !balances || !currentAccount) {
      return TransactionErrorReason.Generic;
    }

    if (transactionRequest.txType === TransactionTypes.ContractCall) {
      if (!validateStacksAddress(transactionRequest.contractAddress))
        return TransactionErrorReason.InvalidContractAddress;
      if ((contractInterface as any)?.isError) return TransactionErrorReason.NoContract;
    }

    if (balances && !getIsMultisig()) {
      const zeroBalance = balances?.stx.unlockedStx.amount.toNumber() === 0;

      if (transactionRequest.txType === TransactionTypes.STXTransfer) {
        if (zeroBalance) return TransactionErrorReason.StxTransferInsufficientFunds;

        const transferAmount = new BigNumber(transactionRequest.amount);
        if (transferAmount.gte(balances?.stx.unlockedStx.amount))
          return TransactionErrorReason.StxTransferInsufficientFunds;
      }

      if (!transactionRequest.sponsored) {
        if (zeroBalance) return TransactionErrorReason.FeeInsufficientFunds;

        const feeValue = stxToMicroStx(values.fee);
        if (feeValue.gte(balances?.stx.unlockedStx.amount))
          return TransactionErrorReason.FeeInsufficientFunds;
      }
    }
    return;
  }, [origin, transactionRequest, balances, currentAccount, contractInterface, values.fee]);
}
