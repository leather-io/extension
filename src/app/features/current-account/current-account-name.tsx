import { Suspense, memo } from 'react';

import { SettingsSelectors } from '@tests/selectors/settings.selectors';
import { Box, BoxProps, styled } from 'leather-styles/jsx';

import { HasChildren } from '@app/common/has-children';
import { useCurrentAccountDisplayName } from '@app/common/hooks/account/use-account-names';
import { truncateString } from '@app/common/utils';
import { BasicTooltip } from '@app/ui/components/tooltip/basic-tooltip';

function AccountNameTitle({ children, ...props }: HasChildren & BoxProps) {
  return (
    <Box {...props}>
      <styled.span data-testid={SettingsSelectors.CurrentAccountDisplayName} textStyle="label.01">
        {children}
      </styled.span>
    </Box>
  );
}

const AccountNameSuspense = memo((props: BoxProps) => {
  const { data: name = 'Account' } = useCurrentAccountDisplayName();
  // FIXME: The name is truncated here with JS but we could just use CSS to do this
  const nameCharLimit = 18;
  const isLong = name.length > nameCharLimit;
  const displayName = truncateString(name, nameCharLimit);
  return (
    <BasicTooltip label={isLong ? name : undefined}>
      <AccountNameTitle {...props}>{displayName}</AccountNameTitle>
    </BasicTooltip>
  );
});

export function CurrentAccountName() {
  const { data: defaultName = 'Account' } = useCurrentAccountDisplayName();
  const fallback = <AccountNameTitle>{defaultName}</AccountNameTitle>;
  return (
    <Suspense fallback={fallback}>
      <AccountNameSuspense />
    </Suspense>
  );
}
