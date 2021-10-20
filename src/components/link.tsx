import React from 'react';
import { Text, BoxProps, color } from '@stacks/ui';

export const buildEnterKeyEvent = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
};

export function Link(props: BoxProps): JSX.Element {
  const { _hover = {}, children, fontSize = '12px', onClick, ...rest } = props;
  return (
    <Text
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      color={color('brand')}
      onKeyPress={buildEnterKeyEvent(onClick as any)}
      onClick={onClick}
      tabIndex={0}
      {...rest}
    >
      {children}
    </Text>
  );
}
