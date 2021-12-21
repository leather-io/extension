import { stacksValue } from '@app/common/stacks-utils';
import { Caption } from '@app/components/typography';
import { useCurrentAccountInfo } from '@app/store/accounts/account.hooks';

export function Balance(): JSX.Element | null {
  const info = useCurrentAccountInfo();

  return info?.balance ? (
    <Caption>
      {stacksValue({
        value: info.balance.toString(),
        withTicker: true,
      })}
    </Caption>
  ) : null;
}
