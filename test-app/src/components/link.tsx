import React, { ReactNode } from 'react';

import { Box, BoxProps, styled } from 'leather-styles/jsx';

interface LinkProps {
  _hover?: BoxProps;
  onClick: () => void;
  children: ReactNode;
  fontSize: string;
  textStyle: string;
}

export const buildEnterKeyEvent = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
};

export const Link: React.FC<LinkProps> = ({
  _hover = {},
  children,
  fontSize = '12px',
  textStyle = 'caption.medium',
  onClick,
  ...rest
}) => (
  <Box {...rest} onKeyPress={buildEnterKeyEvent(onClick)} onClick={onClick} tabIndex={0}>
    <styled.span
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      textStyle={textStyle}
    >
      {children}
    </styled.span>
  </Box>
);

export const MediumLink: React.FC<LinkProps> = ({ children, fontSize = '14px', ...rest }) => (
  <Link fontSize={fontSize} {...rest}>
    {children}
  </Link>
);
