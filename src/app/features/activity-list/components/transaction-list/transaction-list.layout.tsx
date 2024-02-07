import { ReactNode } from 'react';

import { Stack } from 'leather-styles/jsx';

interface TransactionListLayoutProps {
  children: ReactNode;
}
export function TransactionListLayout({ children }: TransactionListLayoutProps) {
  return <Stack pb="space.06">{children}</Stack>;
}
