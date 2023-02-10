import { ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import { Box, Flex, Stack, StackProps, Text, color } from '@stacks/ui';

interface WarningLabelProps extends StackProps {
  children: ReactNode | undefined;
  title?: string;
}
export function WarningLabel({ title, children, ...rest }: WarningLabelProps) {
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
        <Box>
          {title && (
            <Text color="#242629" fontSize={1} fontWeight={500} lineHeight="1.5" marginBottom={1}>
              {title}
            </Text>
          )}
          <Text color="#242629" fontSize="12px" lineHeight="1.5">
            {children}
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
}
