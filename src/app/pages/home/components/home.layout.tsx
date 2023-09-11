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
        maxWidth={['unset', '882px']}
        px={['base-loose', 'base-loose', 'base-loose', 'space.08']}
        width="100%"
        backgroundColor="brown.1"
        borderRadius={['space.00', 'space.02']}
      >
        <AccountInfoCard />
        {children}
      </Stack>
    </Stack>
  );
}
