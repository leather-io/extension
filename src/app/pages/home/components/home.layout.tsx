import React from 'react';

import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AccountInfoCard } from './account-info-card';

type HomeLayoutProps = Record<'currentAccount' | 'children', React.ReactNode>;
export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <Stack alignItems="center" width="100%" mx={['', 'space.04']}>
      <Stack
        data-testid={HomePageSelectors.HomePageContainer}
        maxWidth={['unset', 'unset', '882px']}
        px={['space.04', 'space.04', 'space.08']}
        width="100%"
        backgroundColor="ink.1"
        borderRadius="lg"
      >
        <AccountInfoCard />
        {children}
      </Stack>
    </Stack>
  );
}
