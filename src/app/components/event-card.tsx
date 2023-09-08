import { FiMoreHorizontal } from 'react-icons/fi';

// #4164 FIXME migrate IconButton
import { IconButton } from '@stacks/ui';
import { Box, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { SpaceBetween } from '@app/components/layout/space-between';
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
export function EventCard(props: EventCardProps): React.JSX.Element {
  const { actions, amount, icon, isLast, left, message, right, ticker, title } = props;

  return (
    <>
      <Stack p="base-loose" gap="base-loose">
        <SpaceBetween position="relative">
          <styled.span fontSize={2} textStyle="label.02">
            {title}
          </styled.span>
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
          borderColor={token('colors.accent.background-primary')}
          borderBottom={!isLast ? '4px solid' : 'unset'}
          borderBottomColor={token('colors.accent.background-primary')}
        >
          <Caption>{message}</Caption>
        </Box>
      )}
    </>
  );
}
