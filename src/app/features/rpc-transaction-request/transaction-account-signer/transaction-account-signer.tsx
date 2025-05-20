import { Box, styled } from 'leather-styles/jsx';

import type { Money } from '@leather.io/models';
import { Approver, Caption, ItemLayout, SkeletonLoader } from '@leather.io/ui';
import { formatDustUsdAmounts, formatMoneyPadded, i18nFormatCurrency } from '@leather.io/utils';

import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { AccountNameLayout } from '@app/components/account/account-name';
import { useCurrentAccountIndex } from '@app/store/accounts/account';
import { useStacksAccounts } from '@app/store/accounts/blockchain/stacks/stacks-account.hooks';
import { AccountAvatarItem } from '@app/ui/components/account/account-avatar/account-avatar-item';

interface TransactionAccountSignerProps {
  address: React.ReactNode;
  availableBalance: Money;
  fiatBalance: Money;
  isLoadingBalance: boolean;
}
export function TransactionAccountSigner({
  address,
  availableBalance,
  fiatBalance,
  isLoadingBalance,
}: TransactionAccountSignerProps) {
  const index = useCurrentAccountIndex();
  const stacksAccounts = useStacksAccounts();

  const stxAddress = stacksAccounts[index]?.address || '';
  const { data: name = '', isLoading: isLoadingName } = useAccountDisplayName({
    address: stxAddress,
    index,
  });

  const titleRight = (
    <SkeletonLoader isLoading={isLoadingBalance} width="96px">
      <styled.span textStyle="label.02">{formatMoneyPadded(availableBalance)}</styled.span>
    </SkeletonLoader>
  );

  const captionRight = (
    <SkeletonLoader isLoading={isLoadingBalance} width="48px">
      <Caption>{formatDustUsdAmounts(i18nFormatCurrency(fiatBalance))}</Caption>
    </SkeletonLoader>
  );

  return (
    <Approver.Section>
      <Approver.Subheader>With account</Approver.Subheader>
      <Box mb="space.03">
        <ItemLayout
          showChevron
          img={<AccountAvatarItem index={index} publicKey="" name="" />}
          titleLeft={<AccountNameLayout isLoading={isLoadingName}>{name}</AccountNameLayout>}
          captionLeft={address}
          titleRight={titleRight}
          captionRight={captionRight}
        />
      </Box>
    </Approver.Section>
  );
}
