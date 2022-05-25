import { Flex, StackProps } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';

import { iconStringForAsset } from '@app/common/token-utils';
import { EventCard } from '@app/components/event-card';
import { useSelectedAsset } from '@app/pages/send-tokens/hooks/use-selected-asset';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';

interface SendTokensConfirmDetailsProps extends StackProps {
  amount: number | string;
  nonce?: number;
  recipient: string;
}

export function SendTokensConfirmDetails(props: SendTokensConfirmDetailsProps): JSX.Element {
  const { amount, nonce, recipient, ...rest } = props;
  const { ticker } = useSelectedAsset();
  const currentAccount = useCurrentAccount();
  const { selectedAsset } = useSelectedAsset();
  const icon = iconStringForAsset(selectedAsset);

  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      flexDirection="column"
      data-testid={SendFormSelectors.ConfirmDetails}
      width="100%"
      {...rest}
    >
      <EventCard
        amount={amount}
        icon={icon}
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
