import { Box, BoxProps, styled } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

import { ErrorCircleIcon } from '@app/ui/components/icons/error-circle-icon';

import { Flag } from './layout/flag';

interface WarningLabelProps extends BoxProps {
  title?: string;
}
export function WarningLabel({ children, title, ...props }: WarningLabelProps) {
  return (
    <Box bg="warning.background" borderRadius="sm" {...props}>
      <Flag
        color="accent.notification-text"
        img={<ErrorCircleIcon style={{ color: token('colors.warning.label') }} />}
        minHeight="48px"
        px="space.04"
        py="space.03"
        width="100%"
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
