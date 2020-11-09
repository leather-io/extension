import React, { useCallback, useState } from 'react';
import { Box, PseudoBox, Flex, Text, Button } from '@blockstack/ui';
import { useDispatch } from '@common/hooks/use-dispatch';
import { useWallet } from '@common/hooks/use-wallet';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { ConnectIcon } from '@components/icons/connect-icon';
import { InstallFinished } from '@pages/install/finished';
import { doCreateSecretKey } from '@store/onboarding/actions';

export const Installed: React.FC = () => {
  const dispatch = useDispatch();
  const { identities } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const isSignedIn = identities.length > 0;

  const makeSecretKey = useCallback(async () => {
    setIsCreatingWallet(true);
    await dispatch(doCreateSecretKey());
  }, []);

  if (isSignedIn) {
    return <InstallFinished />;
  }

  return (
    <Flex wrap="wrap" py={5} px={4} flexDirection="column" minHeight="100vh">
      <Flex justifyContent="space-between" align="center" mb={[null, '6vh', '12vh']}>
        <PseudoBox
          _hover={{ cursor: 'pointer' }}
          onClick={() => doChangeScreen(ScreenPaths.INSTALLED)}
        >
          <ConnectIcon />
        </PseudoBox>
        <Box />
      </Flex>
      <Flex flex={1} justifyContent={[null, 'center']}>
        <Flex flexDirection="column" pb="120px" align="center" justify="center" flexGrow={1}>
          <Box>
            <Text fontSize="32px" lineHeight="48px" fontWeight="500">
              Connect is installed
            </Text>
          </Box>
          <Box>
            <Text fontSize="base" lineHeight="48px" color="ink.600">
              Are you new or do you already have a Secret Key?
            </Text>
          </Box>
          <Flex
            flexDirection="column"
            mt={[null, 'base-loose']}
            maxWidth={[null, '396px']}
            minWidth={[null, '396px']}
          >
            <Button onClick={makeSecretKey} isLoading={isCreatingWallet} data-test="sign-up">
              I'm new to Connect
            </Button>
          </Flex>
          <Box pt="base-loose">
            <Text fontSize="14px" lineHeight="20px" color="blue" position="relative">
              <a href="/#/installed/sign-in" title="Continue with Secret Key" data-test="sign-in">
                Continue with Secret Key
              </a>
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
