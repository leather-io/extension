import { useTransactionById } from '@query/transactions/transactions-by-id.query';
import { useRawTxIdState } from '@store/transactions/raw.hooks';

export function useSelectedTx() {
  const [rawTxId] = useRawTxIdState();
  return useTransactionById(rawTxId || '').data;
}
