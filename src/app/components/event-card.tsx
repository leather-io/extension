import { Box, HStack, Stack, styled } from 'leather-styles/jsx';

import { EllipsesHorizontalIcon } from '@app/ui/components/icons/ellipses-h-icon';
import { Caption } from '@app/ui/components/typography/caption';

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
      <Stack gap="space.05" p="space.05">
        <HStack alignItems="center" justifyContent="space-between" position="relative">
          <styled.span textStyle="label.01">{title}</styled.span>
          {/* TODO: What does this do? */}
          {actions && (
            <styled.button width="24px" position="absolute" right={0}>
              <EllipsesHorizontalIcon />
            </styled.button>
          )}
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
        <Box
          p="space.05"
          borderTop="1px solid"
          borderColor="accent.border-default"
          borderBottom={!isLast ? '4px solid' : 'unset'}
          borderBottomColor="accent.border-default"
        >
          <Caption>{message}</Caption>
        </Box>
      )}
    </>
  );
}
