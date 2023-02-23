import { ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { Box, Flex, Stack, StackProps, Text, color } from '@stacks/ui';

interface WarningLabelProps extends StackProps {
  children: ReactNode | undefined;
}
export function WarningLabel({ children, ...rest }: WarningLabelProps) {
  return (
    <Flex width="100%" {...rest}>
      <Stack
        alignItems="center"
        bg="#FFF5EB"
        borderRadius="10px"
        minHeight="48px"
        isInline
        px="base"
        py="base-tight"
        width="100%"
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
        <Text color="#242629" fontSize="12px" lineHeight="1.5">
          {children}
        </Text>
      </Stack>
    </Flex>
  );
}
