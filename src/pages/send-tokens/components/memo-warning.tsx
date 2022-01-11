import React, { FC } from 'react';
import { Flex, Box, color, Text } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';

interface MemoWarningProps {
  symbol: string;
}
export const SendFormMemoWarning: FC<MemoWarningProps> = ({ symbol }) => {
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
            Be sure to include the memo they provided so the {symbol} is credited to your account
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};
