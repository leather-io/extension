import type { ReactNode } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface CardContentProps extends FlexProps {
  children: ReactNode;
  dataTestId?: string;
}

export function CardContent({ children, dataTestId, ...props }: CardContentProps) {
  return (
    <Flex
      alignItems="center"
      data-testid={dataTestId}
      flexDirection="column"
      p="space.05"
      width="100%"
      overflowY="auto"
      style={{ marginBottom: token('sizes.footerHeight') }}
      maxHeight={{ base: '70vh', md: '80vh' }}
      {...props}
    >
      {children}
    </Flex>
  );
}
