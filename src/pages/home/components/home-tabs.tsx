import React from 'react';
import { Box, Stack, SlideFade, Flex } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { Tabs } from '@components/tabs';
import { LoadingSpinner } from '@components/loading-spinner';
import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { useAnalytics } from '@common/hooks/analytics/use-analytics';

interface HomeTabsProps extends StackProps {
  balances: JSX.Element;
  activity: JSX.Element;
}

const ANALYTICS_PATH = ['/balances', '/activity'];

export function HomeTabs(props: HomeTabsProps) {
  const { balances, activity, ...rest } = props;
  const analytics = useAnalytics();

  const { activeTab, setActiveTab } = useHomeTabs();

  const setActiveTabTracked = (index: number) => {
    void analytics.page('view', ANALYTICS_PATH[index]);
    setActiveTab(index);
  };

  return (
    <Stack flexGrow={1} spacing="extra-loose" {...rest}>
      <Tabs
        tabs={[
          { slug: 'balances', label: 'Balances' },
          { slug: 'activity', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTabTracked}
      />
      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <React.Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 0}>
              {styles => (
                <Box style={styles} width="100%">
                  {balances}
                </Box>
              )}
            </SlideFade>
          </React.Suspense>
        )}
        {activeTab === 1 && (
          <React.Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 1}>
              {styles => (
                <Box position="absolute" top={0} left={0} width="100%" style={styles}>
                  {activity}
                </Box>
              )}
            </SlideFade>
          </React.Suspense>
        )}
      </Flex>
    </Stack>
  );
}
