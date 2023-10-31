import { ReactNode } from 'react';

import { ButtonProps, LeatherButton } from '@app/ui/components/button';

interface SettingsMenuItemProps extends ButtonProps {
  color?: string;
  onClick: (e: React.MouseEvent) => void;
  children: ReactNode;
}
export function SettingsMenuItem({ color, onClick, children, ...props }: SettingsMenuItemProps) {
  return (
    <LeatherButton
      _hover={{ bg: 'accent.component-background-hover' }}
      borderRadius="0px"
      color={color ? color : 'accent.text-primary'}
      px="space.04"
      py="space.04"
      onClick={e => {
        onClick?.(e);
      }}
      textStyle="label.02"
      variant="text"
      width="100%"
      {...props}
    >
      {children}
    </LeatherButton>
  );
}
