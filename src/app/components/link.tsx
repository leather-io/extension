import { KeyboardEvent } from 'react';

import { BoxProps, Text, color } from '@stacks/ui';

export const buildEnterKeyEvent = (onClick: () => void) => {
  return (event: KeyboardEvent) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
};

export function Link(props: BoxProps): React.JSX.Element {
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
