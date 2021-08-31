import React, { FC } from 'react';
import { Flex, Text, Box, color } from '@stacks/ui';
import { FiInfo } from 'react-icons/fi';

interface HighFeeWarningLabelProps {
  uStxFee?: number | string;
  appName: string;
}
export const HighFeeWarningLabel: FC<HighFeeWarningLabelProps> = ({ appName }) => {
  return (
    <Box display="inline">
      <Flex flexDirection="row">
        <Text color={color('feedback-alert')} ml="tight">
          Increased by {appName}
        </Text>
        <FiInfo color={color('feedback-alert')} />
      </Flex>
    </Box>
  );
};
