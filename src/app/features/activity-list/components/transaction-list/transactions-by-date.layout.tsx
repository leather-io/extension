import { ReactNode } from 'react';

import { Box, Stack, Text, color } from '@stacks/ui';

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
      <Text textStyle="body.small" color={color('text-caption')}>
        {displayDate}
      </Text>
      <Stack mt="base-loose" spacing="loose">
        {children}
      </Stack>
    </Box>
  );
}
