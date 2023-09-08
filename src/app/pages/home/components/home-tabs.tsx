import { Suspense, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';
import type { StackProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

interface HomeTabsProps extends StackProps {
  children: React.ReactNode;
}
// TODO #4013: Abstract this to generic RouteTab once choose-fee-tab updated
export function HomeTabs({ children }: HomeTabsProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      { slug: RouteUrls.Home, label: 'assets' },
      { slug: RouteUrls.Activity, label: 'activity' },
    ],
    []
  );

  const getActiveTab = useCallback(
    () => tabs.findIndex(tab => tab.slug === pathname),
    [tabs, pathname]
  );

  const setActiveTab = useCallback(
    (index: number) => navigate(tabs[index]?.slug),
    [navigate, tabs]
  );

  return (
    <Stack flexGrow={1} mt="space.05" gap="space.06">
      <Tabs tabs={tabs} activeTab={getActiveTab()} onTabClick={setActiveTab} />
      <Suspense fallback={<LoadingSpinner pb="72px" />}>
        <Box width="100%">{children}</Box>
      </Suspense>
    </Stack>
  );
}
