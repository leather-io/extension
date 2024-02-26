import { ReactNode } from 'react';

import { Box, BoxProps } from 'leather-styles/jsx';

interface SettingsMenuItemProps extends BoxProps {
  color?: string;
  onClick(e: React.MouseEvent): void;
  children: ReactNode;
}
export function SettingsMenuItem({ color, onClick, children, ...props }: SettingsMenuItemProps) {
  return (
    <Box
      _hover={{ bg: 'ink.component-background-hover' }}
      borderRadius="0px"
      color={color ? color : 'ink.text-primary'}
      cursor="pointer"
      onClick={e => onClick?.(e)}
      px="space.04"
      py="space.04"
      textStyle="label.02"
      width="100%"
      {...props}
    >
      {children}
    </Box>
  );
}
