import { Caption } from '@leather.io/ui';
import { truncateMiddle } from '@leather.io/utils';

import { CurrentStacksAccountLoader } from '../loaders/stacks-account-loader';

export function AccountStacksAddress() {
  return (
    <CurrentStacksAccountLoader>
      {account => <Caption>{truncateMiddle(account.address, 4)}</Caption>}
    </CurrentStacksAccountLoader>
  );
}
