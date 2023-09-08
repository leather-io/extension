import { ReactNode } from 'react';

import { Box, BoxProps } from 'leather-styles/jsx';
import { styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { AlertIcon } from './icons/alert-icon';
import { Flag } from './layout/flag';

interface WarningLabelProps extends BoxProps {
  children: ReactNode | undefined;
  title?: string;
}
export function WarningLabel({ children, title, ...props }: WarningLabelProps) {
  return (
    <Box {...props}>
      <Flag
        bg={token('colors.accent.warning')}
        borderRadius="10px"
        img={<AlertIcon color={token('colors.yellow.600')} />}
        minHeight="48px"
        px="space.04"
        py="space.03"
        width="100%"
      >
        {title ? (
          <styled.h1 mb="space.01" textStyle="label.02" color="accent.notification-text">
            {title}
          </styled.h1>
        ) : null}
        <styled.span mb="space.01" textStyle="caption.02" color="accent.notification-text">
          {children}
        </styled.span>
      </Flag>
    </Box>
  );
}
