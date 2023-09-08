import { FiAlertCircle } from 'react-icons/fi';

import { Box, HStack, HstackProps } from 'leather-styles/jsx';
import { token } from 'leather-styles/tokens';

export function ErrorLabel({ children, ...rest }: HstackProps) {
  return (
    <HStack gap="space.02" color={token('colors.error')} alignItems="flex-start" {...rest}>
      <FiAlertCircle
        size="1rem"
        color={token('colors.error')}
        style={{ position: 'relative' }}
        strokeWidth={1.5}
      />
      <Box>{children}</Box>
    </HStack>
  );
}
