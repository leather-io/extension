import React from 'react';

import { Stack } from '@blockstack/ui';

interface ScreenBodyProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
}

export const ScreenBody: React.FC<ScreenBodyProps> = ({ noMinHeight, isLoading, children, ...rest }) => (
  <Stack
    width="100%"
    letterSpacing="tighter"
    minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
    spacing={[4, 6]}
    style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
    {...rest}
  >
    {children}
  </Stack>
);
