import { FiAlertTriangle } from 'react-icons/fi';

import { Box, Stack, StackProps, Text, color } from '@stacks/ui';

interface WarningLabelProps extends StackProps {
  children: React.ReactNode | undefined;
}
export function WarningLabel({ children, ...rest }: WarningLabelProps): JSX.Element {
  return (
    <Stack width="100%" fontSize="12px" {...rest}>
      <Stack
        alignItems="center"
        bg="#FFF5EB"
        borderRadius="10px"
        minHeight="48px"
        isInline
        px="base"
        py="base-tight"
      >
        <Box
          _hover={{ cursor: 'pointer' }}
          as={FiAlertTriangle}
          color={color('feedback-alert')}
          size="16px"
          minWidth="min-content"
          alignSelf="flex-start"
          position="relative"
          top="2px"
        />
        <Text color="#242629" fontSize="inherit" lineHeight="1.5">
          {children}
        </Text>
      </Stack>
    </Stack>
  );
}
