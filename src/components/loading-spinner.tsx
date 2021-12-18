import * as React from 'react';
import { color, Flex, FlexProps, Spinner } from '@stacks/ui';

export const LoadingSpinner: React.FC<FlexProps> = props => {
  return (
    <Flex alignItems="center" flexGrow={1} justifyContent="center" width="100%" {...props}>
      <Spinner color={color('text-caption')} opacity={0.5} size="lg" />
    </Flex>
  );
};
