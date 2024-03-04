import type { ReactNode } from 'react';

import { Flex } from 'leather-styles/jsx';

import { Footer } from '@app/ui/components/containers/footers/footer';

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
      {footer && <Footer variant="card">{footer}</Footer>}
    </Flex>
  );
}
