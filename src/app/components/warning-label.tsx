import { Box, BoxProps, styled } from 'leather-styles/jsx';

import { Flag } from '@app/ui/components/flag/flag';
import { ErrorCircleIcon } from '@app/ui/icons/error-circle-icon';

interface WarningLabelProps extends BoxProps {
  title?: string;
}
export function WarningLabel({ children, title, ...props }: WarningLabelProps) {
  return (
    <Box bg="yellow.background-primary" borderRadius="sm" {...props}>
      <Flag
        align="top"
        color="ink.notification-text"
        img={<ErrorCircleIcon color="yellow.action-primary-default" />}
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
