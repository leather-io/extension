import React from 'react';

// #4164 FIXME migrate useMediaQuery
import { useMediaQuery } from '@stacks/ui';
import { HomePageSelectors } from '@tests/selectors/home.selectors';
import { Stack } from 'leather-styles/jsx';

import { AccountInfoCard } from './account-info-card';

type HomeLayoutProps = Record<'currentAccount' | 'children', React.ReactNode>;
export function HomeLayout({ children }: HomeLayoutProps) {
  const [isNarrowViewport] = useMediaQuery('(max-width: 600px)');

  return (
    <Stack alignItems="center" width="100%" mx={['', 'space.04']}>
      <Stack
        data-testid={HomePageSelectors.HomePageContainer}
        maxWidth={['unset', '882px']}
        px={['base-loose', 'base-loose', 'base-loose', 'space.08']}
        width="100%"
        backgroundColor="brown.1"
        borderRadius={isNarrowViewport ? '0' : '8px'}
      >
        <AccountInfoCard />
        {children}
      </Stack>
    </Stack>
  );
}
