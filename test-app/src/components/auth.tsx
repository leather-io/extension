import React from 'react';

import { useConnect } from '@stacks/connect-react-jwt';
import { OnboardingSelectors } from '@tests/selectors/onboarding.selectors';
import { Box, styled } from 'leather-styles/jsx';

export const Auth: React.FC = () => {
  const { doOpenAuth } = useConnect();
  return (
    <Box>
      Sign in with your Leather to try out a demo of the Stacks 2.0 blockchain.
      <styled.button onClick={() => doOpenAuth()} data-testid={OnboardingSelectors.SignUpBtn}>
        Sign up
      </styled.button>
    </Box>
  );
};
