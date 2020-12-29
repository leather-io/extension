import React, { useState, useCallback } from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { InstallFinished } from '@pages/install/finished';
import { Link } from '@components/link';
import { PopupContainer } from '@components/popup/container';

export const Installed: React.FC = () => {
  const { isSignedIn, doMakeWallet } = useWallet();
  const { doChangeScreen } = useAnalytics();

  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  const register = useCallback(() => {
    setIsCreatingWallet(true);
    doMakeWallet();
  }, [doMakeWallet]);

  if (isSignedIn) {
    return <InstallFinished />;
  }

  return (
    <PopupContainer>
      <Box width="100%" textAlign="center">
        <Box mt="extra-loose">
          <Text fontSize="32px" lineHeight="48px" fontWeight="500">
            Connect is installed
          </Text>
        </Box>
        <Box my="base">
          <Text fontSize="base" color="ink.600">
            Are you new or do you already have a Secret Key?
          </Text>
        </Box>
      </Box>
      <Box flexGrow={1} />
      <Box width="100%" textAlign="center" mb="extra-loose">
        <Flex
          flexDirection="column"
          mt={[null, 'base-loose']}
          maxWidth={[null, '396px']}
          minWidth={[null, '396px']}
        >
          <Button onClick={register} isLoading={isCreatingWallet} data-test="sign-up">
            I'm new to Connect
          </Button>
        </Flex>
        <Box pt="base-loose">
          <Text fontSize="14px" lineHeight="20px" color="blue" position="relative">
            <Link onClick={() => doChangeScreen(ScreenPaths.SIGN_IN_INSTALLED)}>
              Continue with Secret Key
            </Link>
          </Text>
        </Box>
      </Box>
    </PopupContainer>
  );
};
