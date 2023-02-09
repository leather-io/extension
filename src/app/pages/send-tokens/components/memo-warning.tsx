import { FC } from 'react';
import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Text, color } from '@stacks/ui';

interface MemoWarningProps {
  symbol: string;
  isMemoRequired?: boolean;
}
export const SendFormMemoWarning: FC<MemoWarningProps> = ({ symbol, isMemoRequired }) => {
  const warningTitle = isMemoRequired
    ? `It appears you're sending to an exchange`
    : 'Sending to an exchange?';
  const warningText = isMemoRequired
    ? 'You need to include a memo when sending to this address so your deposit gets processed successfully'
    : `Be sure to include the memo they provided so the ${symbol} is credited to your account`;
  const bgColor = isMemoRequired ? '#FFF5EB' : color('bg-alt');
  const iconColor = isMemoRequired ? '#F59300' : color('accent');

  return (
    <Box transition={'0.5s'} background={bgColor} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          <FiInfo color={iconColor} />
        </Box>
        <Box>
          <Text textStyle="body.small.medium">{warningTitle}</Text>
          <Text
            textStyle="body.small"
            color={color('text-caption')}
            lineHeight="22px"
            mt="extra-tight"
            transition={'0.7s'}
          >
            {warningText}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
