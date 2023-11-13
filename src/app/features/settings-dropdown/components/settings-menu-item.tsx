import { ReactNode, memo } from 'react';

import { styled } from 'leather-styles/jsx';

interface SettingsMenuItemTypes {
  color?: string;
  onClick: (e: React.MouseEvent) => void;
  children: ReactNode;
}

export const SettingsMenuItem = memo(({ color, onClick, children }: SettingsMenuItemTypes) => {
  return (
    <styled.span
      width="100%"
      px="base"
      py="base"
      cursor="pointer"
      color={color ? color : 'accent.text-primary'}
      _hover={{ backgroundColor: 'accent.component-background-hover' }}
      onClick={e => {
        onClick?.(e);
      }}
      fontSize={1}
    >
      {children}
    </styled.span>
  );
});
