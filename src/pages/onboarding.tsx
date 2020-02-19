import React from 'react';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { Onboarding } from '@components/onboarding';

const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
  }
  #actions-root {
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
`;

export const OnboardingApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <GlobalStyles />
      <Onboarding />
    </ThemeProvider>
  );
};

export default OnboardingApp;
