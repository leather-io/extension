import { StacksTransaction } from '@stacks/transactions';
import { Box, BoxProps, HStack, Stack } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { useExplorerLink } from '@app/common/hooks/use-explorer-link';
import { getTxSenderAddress } from '@app/common/transactions/stacks/transaction.utils';
import { usePressable } from '@app/components/item-hover';
import { SpaceBetween } from '@app/components/layout/space-between';
import { Tooltip } from '@app/components/tooltip';
import { TransactionTitle } from '@app/components/transaction/transaction-title';
import { Caption, Title } from '@app/components/typography';
import { SubmittedTransactionIcon } from '@app/features/activity-list/components/submitted-transaction-list/submitted-transaction-icon';

import { getSubmittedTransactionDetails } from './submitted-transaction-list.utils';

interface SubmittedTransactionItemProps extends BoxProps {
  transaction: StacksTransaction;
  txId: string;
}
export function SubmittedTransactionItem(props: SubmittedTransactionItemProps) {
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
    <Box {...bind} {...rest}>
      <HStack
        alignItems="center"
        onClick={() =>
          handleOpenTxLink({
            blockchain: 'stacks',
            suffix: `&submitted=true`,
            txid: txId,
          })
        }
        position="relative"
        gap="base-loose"
        zIndex={2}
      >
        <SubmittedTransactionIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack minWidth="0px" gap="space.03">
            <TransactionTitle title={title} />
            <HStack flexWrap="wrap">
              <Caption variant="c2">{caption}</Caption>
              <Tooltip
                placement="bottom"
                label={'Transaction broadcasted, but not yet in the mempool'}
              >
                {/* #4164 FIXME migrate - check text color */}
                <Caption variant="c2" color={token('colors.accent.text-primary')}>
                  Submitted
                </Caption>
              </Tooltip>
            </HStack>
          </Stack>
          <Box alignItems="flex-end">
            {value && (
              <Title as="h3" fontWeight="normal">
                {value}
              </Title>
            )}
          </Box>
        </SpaceBetween>
      </HStack>
      {component}
    </Box>
  );
}
