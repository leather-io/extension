import { BoxProps } from '@stacks/ui';

import { SoftwareWalletAccountWithAddress } from '@app/store/accounts/account.models';
import { Title } from '../typography';

interface AccountTitlePlaceholderProps extends BoxProps {
  account: SoftwareWalletAccountWithAddress;
}
export function AccountTitlePlaceholder({ account, ...rest }: AccountTitlePlaceholderProps) {
  const name = `Account ${account?.index + 1}`;
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
}

interface AccountTitleProps extends BoxProps {
  account: SoftwareWalletAccountWithAddress;
  name: string;
}
export function AccountTitle({ account, name, ...rest }: AccountTitleProps) {
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
}
