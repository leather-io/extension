import type { ReactNode } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';

import { CardFooter } from './components/card-footer';

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
      position={{ base: 'unset', sm: 'relative' }}
      border={{ base: 'unset', sm: 'default' }}
      rounded="lg"
      {...props}
    >
      {header}
      {children}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Flex>
  );
}

// Pete maybe compose <CardFooter in here now too, and <CardContent to avoid repeating it all over the place
// Also update storybook for all this stuff too

// cardContent needs specific props sometimes like p='space.00, or dataTestId='some-id' etc

// also on PSBT signing parts needs to have a maxHeight

// need to test those flows now as could mess up the rest

// > testing PSBT seems to be OK now
// > now is time to review and clean this PR, make / delete components and prep for final tests

// need to test action popup for send + swap against what we now have in prod
// make sure footer is at bottom and scroll is not over doing it
