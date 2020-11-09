import React from 'react';
import { Box, Flex, Text, Button } from '@blockstack/ui';
import { ConnectHeader } from '@pages/install/header';
import { InstalledIllustration } from '@components/icons/installed-illustation';

export const InstallFinished: React.FC = () => {
  return (
    <Flex
      wrap="wrap"
      py={5}
      px={4}
      flexDirection="column"
      minHeight="100vh"
      data-test="install-finished"
    >
      <ConnectHeader />
      <Flex flex={1} justifyContent={[null, 'center']}>
        <Flex flexDirection="column" pb="120px" align="center" justify="center" flexGrow={1}>
          <Flex
            flexDirection="column"
            mt={[null, '6vh']}
            maxWidth={[null, '396px']}
            minWidth={[null, '396px']}
          >
            <InstalledIllustration />
          </Flex>
          <Box mt="base">
            <Text fontSize="32px" lineHeight="48px" fontWeight="500">
              You&apos;re all set!
            </Text>
          </Box>
          <Box maxWidth={[null, '396px']} textAlign="center" mt="base">
            <Text fontSize="base" color="ink.600">
              Access your account and digital assets at any time by clicking the Connect icon in
              your browser.
            </Text>
          </Box>
          <Box maxWidth={[null, '396px']} minWidth={[null, '396px']} mt="base-loose">
            <Button width="100%">Continue to Swapr</Button>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
