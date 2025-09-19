import { Navigate } from 'react-router';

import { useGetRawTransactionByIdQuery } from '@app/query/stacks/transactions/raw-transaction-by-id.query';

interface StacksChainTxSummaryLoaderProps {
  txid: string;
  fallback: React.ReactNode;
  children(args: { rawTx: string }): React.ReactNode;
}
export function StacksChainTxSummaryLoader({
  txid,
  children,
  fallback,
}: StacksChainTxSummaryLoaderProps) {
  const { data: rawTx, error } = useGetRawTransactionByIdQuery(txid);
  if (error) return <Navigate to="/" replace />;
  if (!rawTx) return fallback;
  return children({ rawTx: rawTx.raw_tx });
}
