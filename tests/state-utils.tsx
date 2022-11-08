// This is a wrapper component to provide default/mock data to various atoms
import React, { StrictMode, Suspense } from 'react';

import { Provider } from 'jotai';

import { softwareWalletState } from '@app/store/wallet/wallet';

import { TEST_WALLET } from './mocks';

// This is a wrapper component to provide default/mock data to various atoms
export const ProviderWithTestWallet: React.FC = ({ children }) => (
  <StrictMode>
    <Suspense fallback="loading">
      <Provider initialValues={[[softwareWalletState, TEST_WALLET] as const]}>{children}</Provider>
    </Suspense>
  </StrictMode>
);
