import { useTransactionById } from '@app/query/transactions/transactions-by-id.query';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

export function useSelectedTx() {
  const [rawTxId] = useRawTxIdState();
  return useTransactionById(rawTxId || '').data;
}
