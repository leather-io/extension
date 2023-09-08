import { KeyboardEvent } from 'react';

import { BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

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
    <styled.span
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      // #4164 FIXME migrate color('brand')?
      color={token('colors.accent.text-primary')}
      onKeyPress={buildEnterKeyEvent(onClick as any)}
      onClick={onClick}
      tabIndex={0}
      {...rest}
    >
      {children}
    </styled.span>
  );
}
