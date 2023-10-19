import { Suspense, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack, StackProps } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { useLocationState } from '@app/common/hooks/use-location-state';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

interface HomeTabsProps extends StackProps {
  children: React.ReactNode;
}
// TODO #4013: Abstract this to generic RouteTab once choose-fee-tab updated
export function HomeTabs({ children }: HomeTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = useLocationState<Location>('backgroundLocation');

  const tabs = useMemo(
    () => [
      { slug: RouteUrls.Home, label: 'assets' },
      { slug: `${RouteUrls.Home}${RouteUrls.Activity}`, label: 'activity' },
    ],
    []
  );
  const getActiveTab = useCallback(() => {
    const path = backgroundLocation ? backgroundLocation.pathname : location?.pathname;
    return tabs.findIndex(tab => tab.slug === path);
  }, [tabs, backgroundLocation, location]);

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
