import React from 'react';
import type { Transaction, MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { Box, BoxProps, Button, color, Stack } from '@stacks/ui';
import { isPendingTx } from '@stacks/ui-utils';

import { useExplorerLink } from '@common/hooks/use-explorer-link';

import { Caption, Title } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { TxItemIcon } from '@components/tx-icon';
import { Tooltip } from '@components/tooltip';
import { useCurrentAccount } from '@store/accounts/account.hooks';
import { usePressable } from '@components/item-hover';
import { useRawTxIdState } from '@store/transactions/raw.hooks';
import { FiFastForward } from 'react-icons/all';
import { getTxCaption, getTxTitle } from '@common/transactions/transaction-utils';
import { useTxValue } from '@store/transactions/transaction.hooks';

type Tx = MempoolTransaction | Transaction;

interface TxItemProps {
  transaction: Tx;
}

const Status: React.FC<{ transaction: Tx } & BoxProps> = ({ transaction, ...rest }) => {
  const isPending = isPendingTx(transaction as any);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  return isFailed || isPending ? (
    <Box {...rest}>
      {isPending && (
        <Caption variant="c2" color={color('feedback-alert')}>
          Pending
        </Caption>
      )}
      {isFailed && (
        <Tooltip
          placement="bottom"
          label={
            // TODO: better language around failure
            transaction.tx_status
          }
        >
          <Caption variant="c2" color={color('feedback-error')}>
            Failed
          </Caption>
        </Tooltip>
      )}
    </Box>
  ) : null;
};

const SpeedUpButton = ({
  txid,
  isHovered,
  isEnabled,
}: {
  txid: string;
  isHovered: boolean;
  isEnabled: boolean;
}) => {
  const [rawTxId, setTxId] = useRawTxIdState();
  const isSelected = rawTxId === txid;
  const isActive = isEnabled && !isSelected && isHovered;
  return (
    <Button
      size="sm"
      mode="tertiary"
      fontSize={0}
      onClick={e => {
        setTxId(txid);
        e.stopPropagation();
      }}
      zIndex={999}
      ml="auto"
      opacity={!isActive ? 0 : 1}
      pointerEvents={!isActive ? 'none' : 'all'}
      color={color('text-body')}
      _hover={{
        color: color('text-title'),
      }}
    >
      <Box mr="3px" as={FiFastForward} color={color('accent')} />
      Increase fee
    </Button>
  );
};

export const TxItem: React.FC<TxItemProps & BoxProps> = ({ transaction, ...rest }) => {
  const [component, bind, { isHovered }] = usePressable(true);
  const { handleOpenTxLink } = useExplorerLink();
  const currentAccount = useCurrentAccount();
  const value = useTxValue(transaction, currentAccount);

  if (!transaction) return null;

  const isOriginator = transaction.sender_address === currentAccount?.address;

  const isPending = isPendingTx(transaction as MempoolTransaction);

  return (
    <Box position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
        onClick={() => handleOpenTxLink(transaction.tx_id)}
      >
        <TxItemIcon transaction={transaction} />
        <SpaceBetween flexGrow={1}>
          <Stack spacing="base-tight">
            <Title as="h3" fontWeight="normal">
              {getTxTitle(transaction as any)}
            </Title>
            <Stack isInline flexWrap="wrap">
              <Status transaction={transaction} />
              <Caption variant="c2">{getTxCaption(transaction)}</Caption>
            </Stack>
          </Stack>
          <Stack alignItems="flex-end" spacing="base-tight">
            {value && (
              <Title as="h3" fontWeight="normal">
                {value}
              </Title>
            )}
            <SpeedUpButton
              isEnabled={isPending && isOriginator}
              isHovered={isHovered}
              txid={transaction.tx_id}
            />
          </Stack>
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};
