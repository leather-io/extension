import React from 'react';
import { Box, PseudoBox, Flex } from '@blockstack/ui';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { ConnectIcon } from '@components/icons/connect-icon';

export const ConnectHeader: React.FC = () => {
  const { doChangeScreen } = useAnalytics();
  return (
    <Flex justifyContent="space-between" align="center" mb={[null, '6vh', '12vh']}>
      <PseudoBox _hover={{ cursor: 'pointer' }} onClick={() => doChangeScreen(ScreenPaths.HOME)}>
        <ConnectIcon />
      </PseudoBox>
      <Box />
    </Flex>
  );
};
