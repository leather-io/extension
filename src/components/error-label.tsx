import React from 'react';
import { Box, color, StackProps, Stack } from '@stacks/ui';
import { FiAlertCircle } from 'react-icons/fi';

export const ErrorLabel: React.FC<StackProps> = ({ children, ...rest }) => (
  <Stack spacing="tight" color={color('feedback-error')} isInline alignItems="flex-start" {...rest}>
    <Box
      size="1rem"
      color={color('feedback-error')}
      as={FiAlertCircle}
      position="relative"
      top="2px"
      strokeWidth={1.5}
    />
    <Box>{children}</Box>
  </Stack>
);
