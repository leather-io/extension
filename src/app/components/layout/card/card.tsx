import type { ReactNode } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';

import { CardContent } from './components/card-content';
import { CardFooter } from './components/card-footer';

interface CardProps {
  children: ReactNode;
  dataTestId?: string;
  header?: ReactNode;
  footer?: ReactNode;
  padCardContent?: boolean;
  contentStyle?: FlexProps;
}

export function Card({
  children,
  dataTestId,
  header,
  footer,
  padCardContent = true,
  contentStyle,
  ...props
}: CardProps & FlexProps) {
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
      <CardContent p={padCardContent ? 'space.05' : 'space.00'} {...contentStyle}>
        {children}
      </CardContent>
      {/* {children} */}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Flex>
  );
}

// Also update storybook for all this stuff too

// cardContent needs specific props sometimes like p='space.00, or dataTestId='some-id' etc

// also on PSBT signing parts needs to have a maxHeight

// need to test action popup for send + swap against what we now have in prod
// make sure footer is at bottom and scroll is not over doing it
