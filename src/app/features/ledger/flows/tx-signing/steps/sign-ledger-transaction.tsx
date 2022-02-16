import { useContext, useMemo } from 'react';
import { cvToString, PayloadType } from '@stacks/transactions';

import { ledgerTxSigningContext } from '@app/features/ledger/ledger-tx-signing.context';
import { useHasApprovedTransaction } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { SignLedgerTransactionLayout } from '@app/features/ledger/steps/sign-ledger-transaction.layout';

const sipTenTransferArguments = ['Amount', 'Sender', 'To', 'Memo'];

function formatSipTenTransferArgument(index: number) {
  return `Argument ${index} — ${sipTenTransferArguments[index]}`;
}

export function SignLedgerTransaction() {
  const { transaction } = useContext(ledgerTxSigningContext);
  const hasApprovedTransaction = useHasApprovedTransaction();

  const transactionDetails: [string, string][] = useMemo(() => {
    if (!transaction) return [];

    if (transaction.payload.payloadType === PayloadType.TokenTransfer)
      return [
        ['To', cvToString(transaction.payload.recipient)],
        ['Amount', String(transaction.payload.amount)],
      ];

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
