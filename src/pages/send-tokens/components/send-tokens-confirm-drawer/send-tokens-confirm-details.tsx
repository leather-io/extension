import React from 'react';
import { Flex, StackProps } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';

import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { EventCard } from '@components/event-card';
import { useCurrentAccount } from '@store/accounts/account.hooks';

interface SendTokensConfirmDetailsProps extends StackProps {
  amount: number;
  nonce?: number;
  recipient: string;
}

export function SendTokensConfirmDetails(props: SendTokensConfirmDetailsProps): JSX.Element {
  const { amount, nonce, recipient, ...rest } = props;
  const { ticker } = useSelectedAsset();
  const currentAccount = useCurrentAccount();
  const { selectedAsset } = useSelectedAsset();
  const gradientString = `${selectedAsset?.contractAddress}.${selectedAsset?.contractName}::${selectedAsset?.name}`;
  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      width="100%"
      flexDirection="column"
      {...rest}
    >
      <EventCard
        amount={amount}
        icon={selectedAsset?.contractAddress ? gradientString : 'STX'}
        ticker={ticker || 'STX'}
        title="You will transfer exactly"
        left={
          currentAccount?.address ? `From ${truncateMiddle(currentAccount?.address, 4)}` : undefined
        }
        right={`To ${truncateMiddle(recipient, 4)}`}
      />
    </Flex>
  );
}
