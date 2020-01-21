import React from 'react';

import { Flex, BoxProps } from '@blockstack/ui';

interface ScreenBodyProps extends BoxProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
}

export const ScreenBody: React.FC<ScreenBodyProps> = ({ noMinHeight, isLoading, children, ...rest }) => (
  <Flex
    width="100%"
    flexDirection="column"
    letterSpacing="tighter"
    minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
    style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
    {...rest}
  >
    {children}
  </Flex>
);
