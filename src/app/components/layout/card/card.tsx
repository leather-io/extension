import type { ReactNode } from 'react';

import { Flex, FlexProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

interface CardProps {
  children: ReactNode;
  dataTestId?: string;
  header?: ReactNode;
  footer?: ReactNode;
  footerBorder?: boolean;
  contentStyle?: FlexProps;
}

export function Card({
  children,
  dataTestId,
  header,
  footer,
  contentStyle,
  footerBorder = false,
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
      <Flex
        flexDirection="column"
        width="100%"
        overflowY="auto"
        style={{ marginBottom: footer ? token('sizes.footerHeight') : 0 }}
        p="space.05"
        maxHeight={{ base: '70vh', md: '80vh' }}
        {...contentStyle}
      >
        {children}
      </Flex>
      {footer && (
        <Flex
          bottom={0}
          position="absolute"
          gap="space.05"
          p="space.05"
          width="100vw"
          maxWidth="100%"
          zIndex={1}
          minHeight="footerHeight"
          bg="ink.background-primary"
          borderTop={footerBorder ? 'default' : 'unset'}
          borderBottomLeftRadius="lg"
          borderBottomRightRadius="lg"
        >
          {footer}
        </Flex>
      )}
    </Flex>
  );
}
