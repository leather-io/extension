import { useMemo } from 'react';

import type { Money } from '@leather.io/models';
import { Approver } from '@leather.io/ui';
import { baseCurrencyAmountInQuote, i18nFormatCurrency, sumMoney } from '@leather.io/utils';

import { closeWindow } from '@shared/utils';

import { getTransactionActions } from '../../components/rpc-transaction-request/get-transaction-actions';
import { TransactionActionsTitle } from '../../components/rpc-transaction-request/transaction-actions-title';
import { TransactionError } from '../../components/rpc-transaction-request/transaction-error';
import { useFeeEditorContext } from '../fee-editor/fee-editor.context';
import { useRpcTransactionRequest } from './use-rpc-transaction-request';

interface TransactionActionsWithSpendProps {
  txAmount: Money;
  onApprove(): Promise<void>;
}
export function TransactionActionsWithSpend({
  txAmount,
  onApprove,
}: TransactionActionsWithSpendProps) {
  const { availableBalance, marketData, selectedFee } = useFeeEditorContext();
  const { isBroadcasting, isLoading, isSubmitted } = useRpcTransactionRequest();

  const totalSpend = useMemo(() => {
    const fee = selectedFee?.txFee;
    if (!fee) return txAmount;
    return baseCurrencyAmountInQuote(sumMoney([txAmount, fee]), marketData);
  }, [marketData, selectedFee?.txFee, txAmount]);

  const isInsufficientBalance = availableBalance.amount.isLessThan(totalSpend.amount);

  return (
    <Approver.Actions
      actions={getTransactionActions({
        isBroadcasting,
        isError: isInsufficientBalance,
        isSubmitted,
        isLoading,
        onCancel: () => closeWindow(),
        onApprove,
      })}
    >
      <TransactionActionsTitle isLoading={isLoading} amount={i18nFormatCurrency(totalSpend)} />
      <TransactionError isInsufficientBalance={isInsufficientBalance} isLoading={isLoading} />
    </Approver.Actions>
  );
}
