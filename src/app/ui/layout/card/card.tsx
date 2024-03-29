import type { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, header, footer }: CardProps) {
  return (
    <Flex direction="column">
      {header}
      {children}
      {footer}
    </Flex>
  );
}
