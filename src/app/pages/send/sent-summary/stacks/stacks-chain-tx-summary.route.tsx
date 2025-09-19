import { Navigate, useParams } from 'react-router';

import { deserializeTransaction } from '@stacks/transactions';
import z from 'zod';

import { useLocationStateWithCache } from '@app/common/hooks/use-location-state';
import { StacksChainTxSummaryLoader } from '@app/pages/send/sent-summary/stacks/stacks-chain-tx-summary.loader';

import { Sip10SentSummary, StxSentSummary } from './stacks-chain-tx-summary';
import { StacksChainTxSummaryLoading } from './stacks-chain-tx-summary.layout';

const routeParamsSchema = z.object({
  symbol: z.string(),
  txid: z.string(),
});

export function StacksChainTxSummaryRoute() {
  const { data: params } = routeParamsSchema.safeParse(useParams());
  const tx = useLocationStateWithCache('tx');

  if (!params) return <Navigate to="/" replace />;

  const SummaryComponent =
    params.symbol.toUpperCase() === 'STX' ? StxSentSummary : Sip10SentSummary;

  if (!tx) {
    return (
      <StacksChainTxSummaryLoader
        txid={params.txid}
        fallback={<StacksChainTxSummaryLoading txid={params.txid} />}
      >
        {({ rawTx }) => <SummaryComponent {...params} tx={deserializeTransaction(rawTx)} />}
      </StacksChainTxSummaryLoader>
    );
  }

  return <SummaryComponent {...params} tx={deserializeTransaction(tx)} />;
}
