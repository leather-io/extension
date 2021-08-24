import type { StacksTransaction } from '@stacks/transactions';
import { useLoading } from '@common/hooks/use-loading';
import { useCallback, useEffect } from 'react';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { useMakeAssetTransfer, useMakeStxTransfer } from '@store/transactions/transaction.hooks';

export function useMakeTransferEffect({
  isShowing,
  amount,
  recipient,
  memo,
  transaction,
  setTransaction,
  loadingKey,
}: {
  transaction: StacksTransaction | null;
  isShowing: boolean;
  amount: number;
  recipient: string;
  memo: string;
  setTransaction: (transaction: StacksTransaction) => void;
  loadingKey: string;
}) {
  const { isLoading, setIsLoading, setIsIdle } = useLoading(loadingKey);
  const { selectedAsset } = useSelectedAsset();
  const handleMakeStxTransaction = useMakeStxTransfer();
  const handleMakeFtTransaction = useMakeAssetTransfer();
  const isActive = isShowing && !!amount && !!recipient;
  const notLoaded = selectedAsset && !transaction && !isLoading;
  const method = selectedAsset?.type === 'stx' ? handleMakeStxTransaction : handleMakeFtTransaction;

  const handleGenerateTransfer = useCallback(async () => {
    setIsLoading();
    const tx = await method({
      amount,
      recipient,
      memo,
    });
    if (tx) setTransaction(tx);
    setIsIdle();
  }, [amount, recipient, memo, method, setTransaction, setIsLoading, setIsIdle]);

  useEffect(() => {
    if (isActive && notLoaded) void handleGenerateTransfer();
  }, [isActive, notLoaded, setIsLoading, handleGenerateTransfer]);
}
