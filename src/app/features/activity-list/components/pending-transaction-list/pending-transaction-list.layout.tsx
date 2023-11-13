import { ReactNode } from 'react';

import { Stack, styled } from 'leather-styles/jsx';

interface PendingTransactionListLayoutProps {
  children: ReactNode;
}
export function PendingTransactionListLayout({ children }: PendingTransactionListLayoutProps) {
  return (
    <>
      <styled.span color="accent.text-subdued" textStyle="body.02">
        Pending
      </styled.span>
      <Stack mt="space.04" pb="space.06" gap="space.05">
        {children}
      </Stack>
    </>
  );
}
