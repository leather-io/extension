import React from 'react';

import { useConnect } from '@stacks/connect-react';
import { Box, Button, ButtonGroup, Text } from '@stacks/ui';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';

export const Auth: React.FC = () => {
  const { doOpenAuth } = useConnect();
  return (
    <Box>
      <Text display="block" textStyle="body.large">
        Sign in with your Hiro Wallet to try out a demo of the Stacks 2.0 blockchain.
      </Text>
      <ButtonGroup spacing={'base'} mt={'base-loose'}>
        <Button
          size="lg"
          mode="primary"
          onClick={() => doOpenAuth()}
          data-testid={OnboardingSelectors.SignUpBtn}
        >
          Sign up
        </Button>
      </ButtonGroup>
    </Box>
  );
};
