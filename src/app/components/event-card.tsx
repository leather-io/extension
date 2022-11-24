import { FiMoreHorizontal } from 'react-icons/fi';

import { Box, IconButton, Stack, Text, color } from '@stacks/ui';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { SpaceBetween } from '@app/components/space-between';
import { Caption } from '@app/components/typography';

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
      <Stack p="base-loose" spacing="base-loose">
        <SpaceBetween position="relative">
          <Text fontSize={2} fontWeight={500} data-testid={SendFormSelectors.TransferMessage}>
            {title}
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
