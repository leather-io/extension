import React, { Suspense } from 'react';
import { FiInfo } from 'react-icons/fi';

import { LoadingRectangle } from '@components/loading-rectangle';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import { FeeEstimateDropdown } from '@pages/transaction-signing/components/speed-row/fee-estimate-dropdown';
import { Box, color, Flex, Stack, Tooltip } from '@stacks/ui';

const SpeedRowSuspense = () => {
  return (
    <SpaceBetween>
      <Caption>
        <Flex>
          Speed
          <Box display="inline">
            <Flex flexDirection="row" alignItems="center">
              <Tooltip placement="bottom" label={''}>
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
        </Flex>
      </Caption>
      <Caption>
        <FeeEstimateDropdown />
      </Caption>
    </SpaceBetween>
  );
};

const SpeedRowFallback = () => {
  return (
    <SpaceBetween>
      <Caption>Speed</Caption>
      <LoadingRectangle width="50px" height="10px" />
    </SpaceBetween>
  );
};

export const SpeedRow = () => {
  return (
    <Suspense fallback={<SpeedRowFallback />}>
      <SpeedRowSuspense />
    </Suspense>
  );
};
