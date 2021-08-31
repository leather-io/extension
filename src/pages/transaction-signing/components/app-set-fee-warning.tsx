import React, { FC } from 'react';
import { FiInfo } from 'react-icons/fi';
import { Flex, Text, Box, color, Stack } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
interface HighFeeWarningLabelProps {
  appName: string | undefined;
}

export const HighFeeWarningLabel: FC<HighFeeWarningLabelProps> = ({ appName }) => {
  const warningLabel = `${appName} suggests a higher fee to speed up your transaction. You can edit the fee in the
        settings below.`;

  return appName ? (
    <>
      <Box display="inline">
        <Flex flexDirection="row" alignItems="center">
          <Text color={color('feedback-alert')} ml="tight" mr="extra-tight">
            Increased by {appName}
          </Text>
          <Tooltip placement="bottom" label={warningLabel}>
            <Stack>
              <Box
                _hover={{ cursor: 'pointer' }}
                size="14px"
                color={color('feedback-alert')}
                as={FiInfo}
              />
            </Stack>
          </Tooltip>
        </Flex>
      </Box>
    </>
  ) : null;
};
