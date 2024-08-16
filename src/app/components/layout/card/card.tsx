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
      position="relative"
      border={{ base: 'unset', sm: 'default' }}
      rounded="lg"
      borderBottom={{ base: 'unset', sm: footer ? 'unset' : 'default' }}
      // borderBottom={{ base: 'unset', sm: 'default' }}
    >
      {header}
      {children}
      {footer}
    </Flex>
  );
}

// Pete maybe compose <CardFooter in here now too, and <CardContent to avoid repeating it all over the place
// Also update storybook for all this stuff too

// cardContent needs specific props sometimes like p='space.00, or dataTestId='some-id' etc

// also on PSBT signing parts needs to have a maxHeight

// need to test those flows now as could mess up the rest
