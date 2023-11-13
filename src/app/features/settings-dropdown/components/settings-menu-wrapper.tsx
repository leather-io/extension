import { ReactNode } from 'react';

import { Box } from 'leather-styles/jsx';

interface MenuWrapperProps {
  pointerEvents: string;
  children: ReactNode; //  #4313 FIXME this {children} does nothing
}
// #4313 - TODO rebuild this menu
export function MenuWrapper({ pointerEvents }: MenuWrapperProps) {
  return (
    <Box
      position="absolute"
      top="60px"
      right="space.06"
      borderRadius="10px"
      width="296px"
      boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
      zIndex={2000}
      border="borders.default"
      bg="accent.background-primary"
      py="space.02"
      transformOrigin="top right"
      cursor={pointerEvents}
    />
  );
}
