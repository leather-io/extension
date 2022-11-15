import { FiAlertCircle } from 'react-icons/fi';

import { Box, Stack, StackProps, color } from '@stacks/ui';

export const ErrorLabel = ({ children, ...rest }: StackProps) => (
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
