import { stacksValue } from '@app/common/stacks-utils';
import { Caption, Text } from '@app/components/typography';
import { color } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

interface AccountBalanceCaptionProps {
  availableBalance?: BigNumber;
}
export function AccountBalanceCaption({ availableBalance }: AccountBalanceCaptionProps) {
  const balance = useMemo(
    () =>
      stacksValue({
        value: availableBalance || 0,
        withTicker: true,
        abbreviate: true,
      }),
    [availableBalance]
  );

  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>{balance}</Caption>
    </>
  );
}

export function AccountBalanceLoading() {
  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>Loading…</Caption>
    </>
  );
}
