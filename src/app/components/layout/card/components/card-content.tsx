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
      // style={{ marginBottom: token('sizes.footerHeight') }}
      // marginBottom="footerHeight"
      marginBottom={token('sizes.footerHeight')}
      //PETE need to make sure this won't break all the popup screens then
      // maybe its better as an opt in prop passed in
      // not sure why it won't apply marginBottom="footerHeight without having to use style={{}}
      maxHeight={{ base: '70vh', md: '80vh' }}
      {...props}
    >
      {children}
    </Flex>
  );
}
