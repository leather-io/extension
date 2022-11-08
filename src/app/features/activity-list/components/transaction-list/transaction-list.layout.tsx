import { ReactNode } from 'react';

import { Stack } from '@stacks/ui';

interface TransactionListLayoutProps {
  children: ReactNode;
}
export function TransactionListLayout({ children }: TransactionListLayoutProps) {
  return (
    <Stack pb="extra-loose" spacing="extra-loose">
      {children}
    </Stack>
  );
}
