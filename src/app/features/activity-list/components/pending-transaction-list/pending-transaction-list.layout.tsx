import { ReactNode } from 'react';

import { Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface PendingTransactionListLayoutProps {
  children: ReactNode;
}
export function PendingTransactionListLayout({ children }: PendingTransactionListLayoutProps) {
  return (
    <>
      <styled.span color={token('colors.accent.text-subdued')} textStyle="body.small">
        Pending
      </styled.span>
      <Stack mt="base-loose" pb="space.06" gap="space.05">
        {children}
      </Stack>
    </>
  );
}
