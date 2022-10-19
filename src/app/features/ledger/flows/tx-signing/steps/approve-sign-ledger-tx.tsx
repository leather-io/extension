import { useContext, useMemo } from 'react';
import { cvToString, PayloadType } from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { microStxToStx } from '@app/common/stacks-utils';

import { ledgerTxSigningContext } from '@app/features/ledger/flows/tx-signing/ledger-sign-tx.context';
import { useHasApprovedOperation } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { ApproveLedgerOperationLayout } from '@app/features/ledger/generic-steps/approve-ledger-operation/approve-ledger-operation.layout';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { isSip10Transfer } from '@app/common/transactions/is-sip-10-transfer';

const sipTenTransferArguments = ['Amount', 'Sender', 'To', 'Memo'];

function formatSipTenTransferArgument(index: number) {
  return `Argument ${index} — ${sipTenTransferArguments[index]}`;
}

function formatTooltipLabel(amount: bigint) {
  const stxFromMicroStx = microStxToStx(Number(amount));
  return `The amount is displayed in microstacks (µSTX) and is equal to ${stxFromMicroStx} STX`;
}

export function ApproveSignLedgerTx() {
  const { transaction } = useContext(ledgerTxSigningContext);
  const currentAccount = useCurrentAccount();
  const hasApprovedOperation = useHasApprovedOperation();

  const transactionDetails: [string, string, string?][] = useMemo(() => {
    if (!transaction) return [];

    if (transaction.payload.payloadType === PayloadType.TokenTransfer) {
      return [
        ['Origin', currentAccount?.address ?? ''],
        ['Nonce', String(transaction.auth.spendingCondition.nonce)],
        [
          'Fee (µSTX)',
          String(transaction.auth.spendingCondition.fee),
          formatTooltipLabel(transaction.auth.spendingCondition.fee),
        ],
        [
          'Amount (µSTX)',
          new BigNumber(String(transaction.payload.amount)).toFormat(),
          formatTooltipLabel(transaction.payload.amount),
        ],
        ['To', cvToString(transaction.payload.recipient)],
        ['Memo', transaction.payload.memo.content],
      ];
    }

    if (
      transaction.payload.payloadType === PayloadType.ContractCall &&
      isSip10Transfer(transaction)
    )
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [formatSipTenTransferArgument(index), value]);

    if (transaction.payload.payloadType === PayloadType.ContractCall)
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [`Argument ${index + 0}`, value]);

    return [];
  }, [currentAccount, transaction]);

  return (
    <ApproveLedgerOperationLayout
      description="Verify the transaction details on your Ledger"
      details={transactionDetails}
      status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
    />
  );
}
