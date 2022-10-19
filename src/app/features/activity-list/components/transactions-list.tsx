import { useMemo } from 'react';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { Box, Stack, Text, color } from '@stacks/ui';

import { createTxDateFormatList } from '@app/common/transactions/transaction-utils';
import { Transaction } from '@app/components/transaction/transaction';

interface TransactionsListProps {
  txs: (AddressTransactionWithTransfers | MempoolTransaction)[];
}
export function TransactionsList({ txs }: TransactionsListProps) {
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
              <Transaction transaction={atx} key={'tx' in atx ? atx.tx.tx_id : atx.tx_id} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
