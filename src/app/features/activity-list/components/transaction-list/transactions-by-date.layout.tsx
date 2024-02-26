import { ReactNode } from 'react';

import { Box, Stack, styled } from 'leather-styles/jsx';

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
      <styled.span textStyle="body.02" color="ink.text-subdued">
        {displayDate}
      </styled.span>
      <Stack mt="space.04">{children}</Stack>
    </Box>
  );
}
