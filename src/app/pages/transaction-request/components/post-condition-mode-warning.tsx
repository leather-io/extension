import { FiAlertCircle } from 'react-icons/fi';

import { PostConditionMode } from '@stacks/transactions';
import { Box, Flex, Text, color } from '@stacks/ui';

import { usePostConditionModeState } from '@app/store/transactions/post-conditions.hooks';

export function PostConditionModeWarning(): React.JSX.Element | null {
  const mode = usePostConditionModeState();

  if (mode !== PostConditionMode.Allow) return null;

  return (
    <Box background={color('bg-alt')} borderRadius="10px" mb="loose" px="base-loose" py="base">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiAlertCircle color={color('feedback-error')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium" fontWeight={500}>
            This transaction is not secure
          </Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
          >
            If you confirm, you allow it to transfer any of your tokens. Only confirm if you trust
            and have verified the contract.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
