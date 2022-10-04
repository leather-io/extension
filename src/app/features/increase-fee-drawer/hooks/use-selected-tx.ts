import { useTransactionById } from '@app/query/stacks/transactions/transactions-by-id.query';
import { useRawTxIdState } from '@app/store/transactions/raw.hooks';

export function useSelectedTx() {
  const [rawTxId] = useRawTxIdState();
  return useTransactionById(rawTxId || '').data;
}
