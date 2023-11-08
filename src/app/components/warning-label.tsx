import { Box, BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { AlertIcon } from './icons/alert-icon';
import { Flag } from './layout/flag';

interface WarningLabelProps extends BoxProps {
  title?: string;
}
export function WarningLabel({ children, title, ...props }: WarningLabelProps) {
  return (
    <Box {...props}>
      <Flag
        bg="accent.warning"
        borderRadius="10px"
        img={<AlertIcon color={token('colors.warning')} />}
        minHeight="48px"
        px="base"
        py="base-tight"
        width="100%"
        color="accent.notification-text"
      >
        {title && (
          <styled.h1 mb="space.01" mt={0} textStyle="label.02">
            {title}
          </styled.h1>
        )}
        <styled.span mb="space.01" textStyle="caption.02">
          {children}
        </styled.span>
      </Flag>
    </Box>
  );
}
