import React from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Box, color, IconButton, Stack, Text } from '@stacks/ui';

import { Caption } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

import { TxAssetItem } from './tx-asset-item';

interface EventCardProps {
  actions?: string;
  amount: number | string;
  icon: string;
  isLast?: boolean;
  left?: string;
  message?: string;
  right?: string;
  ticker: string;
  title: string;
}
export function EventCard(props: EventCardProps): JSX.Element {
  const { actions, amount, icon, isLast, left, message, right, ticker, title } = props;

  return (
    <>
      <Stack spacing="base-loose" p="base-loose">
        <SpaceBetween position="relative">
          <Text fontWeight={500} fontSize={2}>
            <span data-testid={SendFormSelectors.TransferMessage}>{title}</span>
          </Text>
          {actions && (
            <IconButton size="24px" icon={FiMoreHorizontal} position="absolute" right={0} />
          )}
        </SpaceBetween>
        <TxAssetItem iconString={icon} amount={amount} ticker={ticker} />
        {left || right ? (
          <SpaceBetween>
            {left ? <Caption>{left}</Caption> : <Box />}
            {right && <Caption>{right}</Caption>}
          </SpaceBetween>
        ) : null}
      </Stack>
      {message && (
        <Box
          p="base-loose"
          borderTop="1px solid"
          borderColor={color('border')}
          borderBottom={!isLast ? '4px solid' : 'unset'}
          borderBottomColor={color('border')}
        >
          <Caption>{message}</Caption>
        </Box>
      )}
    </>
  );
}
