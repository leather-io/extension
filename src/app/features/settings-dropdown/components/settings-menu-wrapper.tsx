import { forwardRef } from 'react';

import { Box, BoxProps } from 'leather-styles/jsx';

interface MenuWrapperProps extends BoxProps {
  isShowing: boolean;
}
export const MenuWrapper = forwardRef<HTMLDivElement, MenuWrapperProps>(
  ({ isShowing, ...props }: MenuWrapperProps, ref) =>
    isShowing ? (
      <Box
        bg="accent.background-primary"
        borderRadius="sm"
        boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08)"
        cursor={isShowing ? 'all' : 'none'}
        position="absolute"
        py="space.02"
        ref={ref}
        right="space.06"
        top="60px"
        transformOrigin="top right"
        width="296px"
        zIndex={2000}
        {...props}
      />
    ) : null
);
