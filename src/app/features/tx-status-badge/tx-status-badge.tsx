import { useQuery } from '@tanstack/react-query';
import { Box } from 'leather-styles/jsx';

import { createGetTransactionByIdQueryOptions } from '@leather.io/query';
import { Badge, Spinner } from '@leather.io/ui';

import { capitalize } from '@app/common/utils';
import { useStacksClient } from '@app/query/stacks/stacks-client';

export function TxStatusBadge({ txid }: { txid: string }) {
  const client = useStacksClient();
  const { data } = useQuery({
    ...createGetTransactionByIdQueryOptions({ client, txid }),
    refetchInterval(query) {
      if (!query.state.data || query.state.data.tx_status === 'pending') return 3000;
      return false;
    },
  });

  if (data?.tx_status === 'pending')
    return (
      <Badge
        label="In mempool"
        icon={
          <Box transform="scale(0.65) translateY(2px)" display="inline-block">
            <Spinner />
          </Box>
        }
      />
    );

  if (data?.tx_status === 'abort_by_response' || data?.tx_status === 'abort_by_post_condition')
    return <Badge variant="error" label={capitalize(data.tx_status.replace('_', ' '))} />;

  return <Badge variant="success" label="Confirmed" />;
}
