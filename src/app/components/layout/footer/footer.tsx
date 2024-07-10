import type { ReactNode } from 'react';

import { Flex, styled } from 'leather-styles/jsx';

interface FooterProps {
  children: ReactNode;
  variant?: 'page' | 'card';
  flexDirection?: 'column' | 'row';
}

export function Footer({ children, variant = 'page', flexDirection = 'column' }: FooterProps) {
  return (
    <styled.footer
      gap="space.05"
      p="space.05"
      bottom={0}
      width="100vw"
      maxWidth={variant === 'card' ? 'pageWidth' : '100%'}
      zIndex={1}
      minHeight="footerHeight"
      position={variant === 'card' ? ' absolute' : 'fixed'}
      borderBottomRadius="md"
      bg={variant === 'page' ? 'ink.background-primary' : undefined}
      borderTop={variant === 'page' ? ' default' : 'none'}
    >
      <Flex flexDirection={flexDirection} width="100%" gap="space.04">
        {children}
      </Flex>
    </styled.footer>
  );
}
