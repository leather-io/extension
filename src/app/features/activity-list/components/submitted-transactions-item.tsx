import { StacksTransaction } from '@stacks/transactions';
import { Box, BoxProps, color, Stack } from '@stacks/ui';

import { usePressable } from '@app/components/item-hover';
import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { SpaceBetween } from '@app/components/space-between';
import { Caption, Title } from '@app/components/typography';
import { Tooltip } from '@app/components/tooltip';
import { TransactionTitle } from '@app/components/transaction/components/transaction-title';
import { StacksTransactionIcon } from '@app/components/transaction/components/stacks-transaction-icon';
import { getTxSenderAddress } from '@app/common/transactions/transaction-utils';

import { getSubmittedTransactionDetails } from './submitted-transactions.utils';

interface SubmittedTransactionsItemProps extends BoxProps {
  transaction: StacksTransaction;
  txId: string;
}
export function SubmittedTransactionsItem(props: SubmittedTransactionsItemProps) {
  const { transaction, txId, ...rest } = props;
  const [component, bind] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();

  if (!transaction) return null;

  const submittedTransactionDetails = getSubmittedTransactionDetails({
    payload: transaction.payload,
    senderAddress: getTxSenderAddress(transaction),
    txId,
  });

  if (!submittedTransactionDetails) return null;

  const { caption, title, value } = submittedTransactionDetails;

  return (
    <Box cursor="pointer" position="relative" {...bind} {...rest}>
      <Stack
        alignItems="center"
        isInline
        onClick={() => handleOpenTxLink(txId, `&submitted=true`)}
        position="relative"
        spacing="base-loose"
        zIndex={2}
      >
        <StacksTransactionIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack minWidth="0px" spacing="base-tight">
            <TransactionTitle title={title} />
            <Stack isInline flexWrap="wrap">
              <Caption variant="c2">{caption}</Caption>
              <Tooltip
                placement="bottom"
                label={'Transaction broadcasted, but not yet in the mempool'}
              >
                <Caption variant="c2" color={color('text-caption')}>
                  Submitted
                </Caption>
              </Tooltip>
            </Stack>
          </Stack>
          <Box alignItems="flex-end">
            {value && (
              <Title as="h3" fontWeight="normal">
                {value}
              </Title>
            )}
          </Box>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
}
