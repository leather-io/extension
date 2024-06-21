import { Box, HStack, Stack, styled } from 'leather-styles/jsx';

import { Caption } from '@leather.io/ui';

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
  const { amount, icon, isLast, left, message, right, ticker, title } = props;

  return (
    <>
      <Stack gap="space.05" p="space.05">
        <HStack alignItems="center" justifyContent="space-between" position="relative">
          <styled.span textStyle="label.01">{title}</styled.span>
        </HStack>
        <TxAssetItem iconString={icon} amount={amount} ticker={ticker} />
        {left || right ? (
          <HStack alignItems="center" justifyContent="space-between">
            {left ? <Caption>{left}</Caption> : <Box />}
            {right && <Caption>{right}</Caption>}
          </HStack>
        ) : null}
      </Stack>
      {message && (
        <Box p="space.05" borderTop="default" borderBottom={!isLast ? 'active' : 'unset'}>
          <Caption>{message}</Caption>
        </Box>
      )}
    </>
  );
}
