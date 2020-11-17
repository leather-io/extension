import React from 'react';
import { Box, Flex } from '@stacks/ui';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { ConnectIcon } from '@components/icons/connect-icon';

export const ConnectHeader: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  return (
    <Flex justifyContent="space-between" align="center" mb={[null, '6vh', '12vh']}>
      <Box _hover={{ cursor: 'pointer' }} onClick={() => doChangeScreen(ScreenPaths.HOME)}>
        <ConnectIcon />
      </Box>
      <Box />
    </Flex>
  );
};
