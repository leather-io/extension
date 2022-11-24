import { Flex, StackProps } from '@stacks/ui';
import { color, truncateMiddle } from '@stacks/ui-utils';
import { SendFormSelectors } from '@tests-legacy/page-objects/send-form.selectors';

import { getIconString } from '@app/common/crypto-assets/stacks-crypto-asset.utils';
import { useSelectedAssetBalance } from '@app/common/hooks/use-selected-asset-balance';
import { EventCard } from '@app/components/event-card';
import { getStacksFungibleTokenCurrencyAssetBalance } from '@app/query/stacks/balance/crypto-asset-balances.utils';
import { useCurrentAccount } from '@app/store/accounts/account.hooks';

interface SendTokensConfirmDetailsProps extends StackProps {
  amount: number | string;
  assetId: string;
  recipient: string;
}
export function SendTokensConfirmDetails(props: SendTokensConfirmDetailsProps): JSX.Element {
  const { amount, assetId, recipient, ...rest } = props;
  const { selectedAssetBalance, ticker } = useSelectedAssetBalance(assetId);
  const currentAccount = useCurrentAccount();
  const tokenCurrencyAssetBalance =
    getStacksFungibleTokenCurrencyAssetBalance(selectedAssetBalance);
  const icon = tokenCurrencyAssetBalance ? getIconString(tokenCurrencyAssetBalance.asset) : '';

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
