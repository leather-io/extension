import { Suspense, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { HasChildren } from '@app/common/has-children';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

export function SwapSummaryTabs({ children }: HasChildren) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      { slug: RouteUrls.SwapSummary, label: 'Status' },
      { slug: RouteUrls.SwapSummaryDetails, label: 'Swap details' },
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
    <Stack flexGrow={1} gap="space.04" mt="space.01" width="100%">
      <Tabs tabs={tabs} activeTab={getActiveTab()} onTabClick={setActiveTab} />
      <Suspense fallback={<LoadingSpinner />}>
        <Box width="100%">{children}</Box>
      </Suspense>
    </Stack>
  );
}
