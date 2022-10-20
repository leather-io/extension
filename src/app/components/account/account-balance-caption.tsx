import { useMemo } from 'react';
import { color } from '@stacks/ui';

import { stacksValue } from '@app/common/stacks-utils';
import { Caption, Text } from '@app/components/typography';
import { Money } from '@shared/models/money.model';

interface AccountBalanceCaptionProps {
  availableBalance: Money;
}
export function AccountBalanceCaption({ availableBalance }: AccountBalanceCaptionProps) {
  const balance = useMemo(
    () =>
      stacksValue({
        value: availableBalance.amount ?? 0,
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
      {availableBalance.amount.isGreaterThan(0) && (
        <>
          <Text color={color('text-caption')} fontSize="10px">
            •
          </Text>
        </>
      )}
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
