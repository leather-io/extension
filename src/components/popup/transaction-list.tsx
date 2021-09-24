import { createTxDateFormatList } from '@common/transactions/transaction-utils';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Box, Stack, Text, color } from '@stacks/ui';
import React, { useMemo } from 'react';
import { TxView } from '@components/popup/tx-item';

interface TransactionListProps {
  txs: (AddressTransactionWithTransfers | MempoolTransaction)[];
}

export function TransactionList({ txs }: TransactionListProps) {
  const txsGroupedByDate = useMemo(() => (txs ? createTxDateFormatList(txs) : []), [txs]);
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      {txsGroupedByDate.map(({ date, displayDate, txs }) => (
        <Box key={date}>
          <Text textStyle="body.small" color={color('text-caption')}>
            {displayDate}
          </Text>
          <Stack mt="base-loose" spacing="loose">
            {txs.map(atx => (
              <TxView transaction={atx} key={'tx' in atx ? atx.tx.tx_id : atx.tx_id} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
