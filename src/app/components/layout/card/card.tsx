import type { ReactNode } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';

interface CardProps {
  children: ReactNode;
  dataTestId?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ children, dataTestId, header, footer, ...props }: CardProps & FlexProps) {
  return (
    <Flex
      data-testid={dataTestId}
      direction="column"
      {...props}
      border={{ base: 'unset', sm: 'default' }}
      rounded="lg"
    >
      {header}
      {children}
      {footer}
    </Flex>
  );
}
