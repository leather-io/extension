import { Suspense, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, SlideFade, Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

interface HomeTabsProps extends StackProps {
  children: React.JSX.Element;
}

export function HomeTabs(props: HomeTabsProps) {
  //  It's unclear if ...rest is even needed here
  const { children, ...rest } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      { slug: RouteUrls.Balances, label: 'Balances' },
      { slug: RouteUrls.Activities, label: 'Activity' },
    ],
    []
  );

  const getActiveTab = useCallback(
    () => (pathname !== '/' ? tabs.findIndex(tab => tab.slug === pathname) : 0),
    [tabs, pathname]
  );

  return (
    // it's unclear if ...rest is even needed here also and it gets passed all the way along
    <Stack flexGrow={1} mt="loose" spacing="extra-loose" {...rest}>
      <Tabs
        tabs={tabs}
        activeTab={getActiveTab()}
        onTabClick={navigate}
        width={['100%', '193px']}
      />
      <Flex position="relative" flexGrow={1}>
        <Suspense fallback={<LoadingSpinner pb="72px" />}>
          <SlideFade in={true}>
            {styles => (
              <Box style={styles} width="100%">
                {children}
              </Box>
            )}
          </SlideFade>
        </Suspense>
      </Flex>
    </Stack>
  );
}
