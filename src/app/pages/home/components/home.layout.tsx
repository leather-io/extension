import React from 'react';

import { Flex, Stack } from '@stacks/ui';
import { HomePageSelectors } from '@tests-legacy/page-objects/home.selectors';

import { HOME_FULL_PAGE_MAX_WIDTH } from '@app/components/global-styles/full-page-styles';

type HomeLayoutProps = Record<
  'suggestedFirstSteps' | 'currentAccount' | 'actions' | 'children',
  React.ReactNode
>;
export function HomeLayout(props: HomeLayoutProps) {
  const { suggestedFirstSteps, currentAccount, actions, children } = props;
  return (
    <Stack alignItems="center" width="100%" spacing="extra-tight">
      {suggestedFirstSteps}
      <Stack
        data-testid={HomePageSelectors.HomePageContainer}
        maxWidth={['unset', HOME_FULL_PAGE_MAX_WIDTH]}
        mt="extra-loose"
        px={['base-loose', 'base-loose', 'base-loose', 'unset']}
        spacing="loose"
        width="100%"
      >
        <Flex
          flexDirection={['column', 'column', 'unset']}
          alignItems={['start', 'start', 'center']}
          justifyContent={['unset', 'space-between']}
        >
          {currentAccount}
          {actions}
        </Flex>
        {children}
      </Stack>
    </Stack>
  );
}
