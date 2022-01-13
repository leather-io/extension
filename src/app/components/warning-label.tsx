import { FiAlertTriangle } from 'react-icons/fi';
import { Box, color, Stack, StackProps, Text } from '@stacks/ui';

interface WarningLabelProps extends StackProps {
  children: string | Element | undefined;
}
export function WarningLabel({ children, ...rest }: WarningLabelProps): JSX.Element {
  return (
    <Stack width="100%" {...rest}>
      <Stack alignItems="center" bg="#FFF5EB" borderRadius="10px" height="48px" isInline pl="base">
        <Box
          _hover={{ cursor: 'pointer' }}
          as={FiAlertTriangle}
          color={color('feedback-alert')}
          size="16px"
        />
        <Text color={color('text-title')} fontSize="12px" fontWeight="500">
          {children}
        </Text>
      </Stack>
    </Stack>
  );
}
