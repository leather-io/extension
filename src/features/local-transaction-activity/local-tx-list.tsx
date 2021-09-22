import { useCurrentAccountLocalStacksTransaction } from '@store/accounts/account-activity.hooks';
import { LocalTxItem } from '@features/local-transaction-activity/local-tx-item';
import React from 'react';
import { Box, color, Stack, Text } from '@stacks/ui';

const LocalTxListItem = ({ txid }: { txid: string }) => {
  const localTx = useCurrentAccountLocalStacksTransaction(txid);
  if (localTx) return <LocalTxItem txid={txid} transaction={localTx.transaction} />;
  return <>Loading...</>;
};
export const LocalTxList = ({ txids }: { txids: string[] }) => {
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      <Box>
        <Text textStyle="body.small" color={color('text-caption')}>
          Queued
        </Text>
        <Stack mt="base-loose" spacing="loose">
          {txids.map(txid => (
            <LocalTxListItem txid={txid} key={txid} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};
