import { FC, memo } from 'react';
import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { BoxProps } from '@stacks/ui';

import { Title } from '@app/components/typography';
import { useGetAccountNamesByAddressQuery } from '@app/query/bns/bns.hooks';
import { getAccountDisplayName } from '@app/common/utils/get-account-display-name';

const AccountNameLayout: FC = memo(({ children }) => (
  <Title fontSize={2} lineHeight="1rem" fontWeight="400">
    {children}
  </Title>
));

interface AccountNameProps extends BoxProps {
  address: string;
  index: number;
}
export const AccountName = memo(({ address, index }: AccountNameProps) => {
  const name = useGetAccountNamesByAddressQuery(address);
  return (
    <AccountNameLayout>
      {name[0] ?? (index ? getAccountDisplayName({ index }) : '')}
    </AccountNameLayout>
  );
});

interface AccountNameFallbackProps {
  account: SoftwareWalletAccountWithAddress;
}
export const AccountNameFallback = memo(({ account }: AccountNameFallbackProps) => {
  const defaultName = getAccountDisplayName(account);
  return <AccountNameLayout>{defaultName}</AccountNameLayout>;
});
