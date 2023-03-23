import { ReactNode } from 'react';

import { Stack, Text, color } from '@stacks/ui';

interface PendingTransactionListLayoutProps {
  children: ReactNode;
}
export function PendingTransactionListLayout({ children }: PendingTransactionListLayoutProps) {
  return (
    <>
      <Text color={color('text-caption')} textStyle="body.small">
        Pending
      </Text>
      <Stack mt="base-loose" pb="extra-loose" spacing="loose">
        {children}
      </Stack>
    </>
  );
}
