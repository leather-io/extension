import { memo } from 'react';
import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';
import { useAccountDisplayName } from '@app/common/hooks/account/use-account-names';

import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';

const AccountNameLayout = memo(({ children }) => (
  <Title fontSize={2} lineHeight="1rem" fontWeight="400">
    {children}
  </Title>
));

interface AccountNameProps extends BoxProps {
  account: SoftwareWalletAccountWithAddress;
}
export const AccountName = memo(({ account }: AccountNameProps) => {
  const name = useAccountDisplayName(account);
  return <AccountNameLayout>{name}</AccountNameLayout>;
});

interface AccountNameFallbackProps {
  account: SoftwareWalletAccountWithAddress;
}
export const AccountNameFallback = memo(({ account }: AccountNameFallbackProps) => {
  const defaultName = getAccountDisplayName(account);
  return <AccountNameLayout>{defaultName}</AccountNameLayout>;
});
