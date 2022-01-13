import React from 'react';
import { Button, Text, Box, ButtonGroup } from '@stacks/ui';
import { useConnect } from '@stacks/connect-react';
import { OnboardingSelectors } from '@tests/integration/onboarding/onboarding.selectors';

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
