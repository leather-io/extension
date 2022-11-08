import { Suspense } from 'react';

import { Box, Flex, SlideFade, Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useHomeTabs } from '@app/common/hooks/use-home-tabs';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

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
    <Stack flexGrow={1} mt="loose" spacing="extra-loose" {...rest}>
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
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 0}>
              {styles => (
                <Box style={styles} width="100%">
                  {balances}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={activeTab === 1}>
              {styles => (
                <Box width="100%" style={styles}>
                  {activity}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
      </Flex>
    </Stack>
  );
}
