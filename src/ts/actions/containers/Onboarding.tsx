import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Onboarding } from '@components/sign-up/onboarding';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';

export const OnboardingApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CSSReset />
        <Onboarding />
        {/* <Flex pt={6} px={2} wrap="wrap">
          <Gutter base={6} multiplier={2} width="100%" />
          <Box width="100%" textAlign="center">
            <Text textStyle="display.large">
              {!manifest ? 'Loading...' : `Sign in to ${manifest.name}`}
            </Text>
          </Box>
          <Gutter multiplier={1} width="100%" />
          <Box width="100%" textAlign="center" pt={6} px={4}>
            <Button
              isLoading={!manifest}
              variant="solid"
              mt={6}
              size="lg"
              onClick={signIn}
            >
              Continue
            </Button>
          </Box>
        </Flex> */}
      </React.Fragment>
    </ThemeProvider>
  );
};

export default hot(OnboardingApp);
