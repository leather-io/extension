import { usePostConditionModeState } from '@store/transactions/post-conditions.hooks';
import { PostConditionMode } from '@stacks/transactions';
import { Box, color, Flex, Text } from '@stacks/ui';
import { FiAlertCircle } from 'react-icons/fi';
import React from 'react';

export const PostConditionModeWarning = () => {
  const mode = usePostConditionModeState();

  if (mode !== PostConditionMode.Allow) return null;

  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiAlertCircle color={color('feedback-error')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium" fontWeight={500}>
            Calling this function is not secure.
          </Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
          >
            This function is set to <strong>ALLOW</strong> mode. Any post conditions defined will
            have no effect.
            <br />
            <Box as="span" fontWeight={500} color={color('feedback-error')}>
              Proceed with caution.
            </Box>
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
