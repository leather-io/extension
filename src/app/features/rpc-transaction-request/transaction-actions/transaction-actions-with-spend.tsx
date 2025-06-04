import { useMemo } from 'react';

import type { Money } from '@leather.io/models';
import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency, sumMoney } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

import { getTransactionActions } from '@app/components/rpc-transaction-request/get-transaction-actions';
import { TransactionActionsTitle } from '@app/components/rpc-transaction-request/transaction-actions-title';
import { TransactionError } from '@app/components/rpc-transaction-request/transaction-error';
import { useFeeEditorContext } from '@app/features/fee-editor/fee-editor.context';

import { useRpcTransactionRequest } from '../use-rpc-transaction-request';

interface TransactionActionsWithSpendProps {
  isLoading: boolean;
  isSponsored: boolean;
  txAmount: Money;
  onApprove(): Promise<void>;
}
export function TransactionActionsWithSpend({
  isLoading,
  isSponsored,
  txAmount,
  onApprove,
}: TransactionActionsWithSpendProps) {
  const { availableBalance, marketData, selectedFee } = useFeeEditorContext();
  const { status } = useRpcTransactionRequest();

  const totalSpend = useMemo(() => {
    const fee = selectedFee?.txFee;
    if (!fee) return txAmount;
    return baseCurrencyAmountInQuote(sumMoney([txAmount, fee]), marketData);
  }, [marketData, selectedFee?.txFee, txAmount]);

  // TODO LEA-2537: Refactor error state
  const isInsufficientBalance =
    !isSponsored && availableBalance.amount.isLessThan(totalSpend.amount);

  return (
    <Approver.Actions
      actions={getTransactionActions({
        isLoading,
        isBroadcasting: status === 'broadcasting',
        isSubmitted: status === 'submitted',
        isError: isInsufficientBalance,
        onCancel: () => closeWindow(),
        onApprove,
      })}
    >
      <TransactionActionsTitle isLoading={isLoading} amount={i18nFormatCurrency(totalSpend)} />
      <TransactionError isInsufficientBalance={isInsufficientBalance} isLoading={isLoading} />
    </Approver.Actions>
  );
}
