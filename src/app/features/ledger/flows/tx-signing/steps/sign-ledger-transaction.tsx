import { useContext, useMemo } from 'react';
import { cvToString, PayloadType } from '@stacks/transactions';
import { useMediaQuery } from '@stacks/ui';
import { BigNumber } from 'bignumber.js';

import { microStxToStx } from '@app/common/stacks-utils';
import { DESKTOP_VIEWPORT_MIN_WIDTH } from '@app/components/global-styles/full-page-styles';
import { ledgerTxSigningContext } from '@app/features/ledger/ledger-tx-signing.context';
import { useHasApprovedTransaction } from '@app/features/ledger/hooks/use-has-approved-transaction';
import { SignLedgerTransactionLayout } from '@app/features/ledger/steps/sign-ledger-transaction.layout';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

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
  const currentAccount = useCurrentAccount();
  const hasApprovedTransaction = useHasApprovedTransaction();

  const [desktopViewport] = useMediaQuery(`(min-width: ${DESKTOP_VIEWPORT_MIN_WIDTH})`);

  const transactionDetails: [string, string, string?][] = useMemo(() => {
    if (!transaction) return [];

    if (transaction.payload.payloadType === PayloadType.TokenTransfer) {
      return [
        ['Origin', currentAccount?.address || ''],
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

    if (transaction.payload.payloadType === PayloadType.ContractCall)
      return transaction.payload.functionArgs
        .map(cv => cvToString(cv))
        .map((value, index) => [formatSipTenTransferArgument(index), value]);

    return [];
  }, [currentAccount, transaction]);

  return (
    <SignLedgerTransactionLayout
      details={transactionDetails}
      isFullPage={desktopViewport}
      status={hasApprovedTransaction ? 'approved' : 'awaiting-approval'}
    />
  );
}
