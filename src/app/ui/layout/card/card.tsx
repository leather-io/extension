import type { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

interface CardProps {
  children: ReactNode;
  dataTestId?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, dataTestId, header, footer }: CardProps) {
  return (
    <Flex data-testid={dataTestId} direction="column">
      {header}
      {children}
      {footer}
    </Flex>
  );
}
