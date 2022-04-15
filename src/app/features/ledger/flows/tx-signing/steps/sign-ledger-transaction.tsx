import { useContext, useMemo } from 'react';
import { cvToString, PayloadType } from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { microStxToStx } from '@app/common/stacks-utils';
import { ledgerTxSigningContext } from '@app/features/ledger/ledger-tx-signing.context';
import { useHasApprovedTransaction } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { SignLedgerTransactionLayout } from '@app/features/ledger/steps/sign-ledger-transaction.layout';

const sipTenTransferArguments = ['Amount', 'Sender', 'To', 'Memo'];

function formatSipTenTransferArgument(index: number) {
  return `Argument ${index} — ${sipTenTransferArguments[index]}`;
}

function formatTooltipLabel(amount: bigint) {
  const stxFromMicroStx = microStxToStx(Number(amount));
  return `The amount is displayed in microstacks (µSTX) and is equal to ${stxFromMicroStx} STX`;
}

export function SignLedgerTransaction() {
  const { transaction } = useContext(ledgerTxSigningContext);
  const hasApprovedTransaction = useHasApprovedTransaction();

  const transactionDetails: [string, string, string?][] = useMemo(() => {
    if (!transaction) return [];

    if (transaction.payload.payloadType === PayloadType.TokenTransfer) {
      return [
        ['To', cvToString(transaction.payload.recipient)],
        [
          'Amount (µSTX)',
          new BigNumber(String(transaction.payload.amount)).toFormat(),
          formatTooltipLabel(transaction.payload.amount),
        ],
      ];
    }

    if (transaction.payload.payloadType === PayloadType.ContractCall)
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [formatSipTenTransferArgument(index), value]);

    return [];
  }, [transaction]);

  return (
    <SignLedgerTransactionLayout
      details={transactionDetails}
      status={hasApprovedTransaction ? 'approved' : 'awaiting-approval'}
    />
  );
}
