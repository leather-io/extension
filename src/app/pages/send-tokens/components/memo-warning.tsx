import { FC } from 'react';
import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Text, color } from '@stacks/ui';

interface MemoWarningProps {
  symbol: string;
  isMemoRequired?: boolean;
}
export const SendFormMemoWarning: FC<MemoWarningProps> = ({ symbol, isMemoRequired }) => {
  const warningText = isMemoRequired
    ? 'We detected an address that is likely owned by a Centralized Exchange, a memo is mandatory.'
    : `Be sure to include the memo they provided so the ${symbol} is credited to your account`;
  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiInfo color={color('accent')} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium">Sending to an exchange?</Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
          >
            {warningText}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
