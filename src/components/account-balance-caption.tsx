import { stacksValue } from '@common/stacks-utils';
import { Caption, Text } from '@components/typography';
import { color } from '@stacks/ui';
import BigNumber from 'bignumber.js';

interface AccountBalanceCaptionProps {
  availableBalance?: BigNumber;
}
export function AccountBalanceCaption({ availableBalance }: AccountBalanceCaptionProps) {
  const balance = stacksValue({
    value: availableBalance || 0,
    withTicker: true,
    abbreviate: true,
  });

  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>{balance}</Caption>
    </>
  );
}
