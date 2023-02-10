import { ReactNode } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

import { Box, Flex, Stack, StackProps, Text, color } from '@stacks/ui';

import { Caption } from './typography';

interface InfoLabelProps extends StackProps {
  children: ReactNode | undefined;
  title: string;
}
export function InfoLabel({ children, title, ...rest }: InfoLabelProps) {
  return (
    <Flex width="100%" {...rest}>
      <Stack
        alignItems="start"
        bg="#F5F5F7"
        borderRadius="10px"
        minHeight="48px"
        px="base"
        py="base-tight"
        spacing="tight"
      >
        <Flex>
          <Box
            _hover={{ cursor: 'pointer' }}
            as={FiAlertCircle}
            color={color('accent')}
            size="16px"
            minWidth="min-content"
            alignSelf="flex-start"
            position="relative"
            top="2px"
            marginRight={2}
          />
          <Box>
            <Text color="#242629" fontSize={1} fontWeight={500} lineHeight="1.5">
              {title}
            </Text>

            <Caption lineHeight="1.5">{children}</Caption>
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
}
