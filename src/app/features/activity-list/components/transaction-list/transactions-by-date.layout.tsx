import { ReactNode } from 'react';

import { Box, Stack, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface TransactionByDateLayoutProps {
  children: ReactNode;
  date: string;
  displayDate: string;
}
export function TransactionsByDateLayout({
  children,
  date,
  displayDate,
}: TransactionByDateLayoutProps) {
  return (
    <Box key={date}>
      <styled.span textStyle="body.small" color={token('colors.accent.text-subdued')}>
        {displayDate}
      </styled.span>
      <Stack mt="base-loose" gap="space.05">
        {children}
      </Stack>
    </Box>
  );
}
