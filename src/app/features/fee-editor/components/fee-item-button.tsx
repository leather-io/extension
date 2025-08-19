import { ReactNode } from 'react';

import { styled } from 'leather-styles/jsx';

interface FeeItemButtonProps {
  onClick(): void;
  isSelected?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function FeeItemButton({ onClick, isSelected, disabled, children }: FeeItemButtonProps) {
  return (
    <styled.button
      onClick={onClick}
      p="space.03"
      borderRadius="sm"
      opacity={disabled ? 0.5 : 1}
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected && !disabled ? 'ink.border-selected' : 'ink.border-default'}
      margin={isSelected ? '0px' : '1px'}
      disabled={disabled}
    >
      {children}
    </styled.button>
  );
}
