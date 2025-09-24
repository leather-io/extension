import { useMemo } from 'react';

import { PayloadType, cvToString } from '@stacks/transactions';
import { BigNumber } from 'bignumber.js';

import { microStxToStx } from '@leather.io/utils';

import { isSip10TransferContactCall } from '@app/common/transactions/stacks/transaction.utils';
import { useLedgerTxSigningContext } from '@app/features/ledger/generic-flows/tx-signing/ledger-sign-tx.context';
import { ApproveLedgerOperationLayout } from '@app/features/ledger/generic-steps/approve-ledger-operation/approve-ledger-operation.layout';
import { useHasApprovedOperation } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { useCurrentStacksAccount } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';

const sipTenTransferArguments = ['Amount', 'Sender', 'To', 'Memo'];

function formatSipTenTransferArgument(index: number) {
  return `Argument ${index} — ${sipTenTransferArguments[index]}`;
}

function formatTooltipLabel(amount: bigint) {
  const stxFromMicroStx = microStxToStx(Number(amount));
  return `The amount is displayed in microstacks (µSTX) and is equal to ${stxFromMicroStx} STX`;
}

export function ApproveSignLedgerStacksTx() {
  const { transaction, chain } = useLedgerTxSigningContext();
  const currentAccount = useCurrentStacksAccount();
  const hasApprovedOperation = useHasApprovedOperation();

  const transactionDetails: [string, string, string?][] = useMemo(() => {
    if (!transaction || chain !== 'stacks') return [];

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
      isSip10TransferContactCall(transaction)
    )
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [formatSipTenTransferArgument(index), value]);

    if (transaction.payload.payloadType === PayloadType.ContractCall)
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [`Argument ${index + 0}`, value]);

    if (
      transaction.payload.payloadType === PayloadType.SmartContract ||
      transaction.payload.payloadType === PayloadType.VersionedSmartContract
    ) {
      return [
        ['Contract address', currentAccount?.address ?? ''],
        ['Contract name', transaction.payload.contractName.content],
        ['Contract code', transaction.payload.codeBody.content],
        ['Nonce', String(transaction.auth.spendingCondition.nonce)],
        [
          'Fee (µSTX)',
          String(transaction.auth.spendingCondition.fee),
          formatTooltipLabel(transaction.auth.spendingCondition.fee),
        ],
      ];
    }

    return [];
  }, [chain, currentAccount?.address, transaction]);

  return (
    <ApproveLedgerOperationLayout
      description="Verify the transaction details on your Ledger"
      details={transactionDetails}
      status={hasApprovedOperation ? 'approved' : 'awaiting-approval'}
    />
  );
}
