import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Box, color, Stack, Text } from '@stacks/ui';

interface WarningLabelProps {
  children: string | Element | undefined;
}

export function WarningLabel(props: WarningLabelProps): JSX.Element {
  const { children } = props;

  return (
    <Stack width="100%">
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
