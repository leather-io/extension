import { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/ui/components/tabs/tabs';

interface HomeTabsProps {
  children: React.ReactNode;
}
// TODO #4013: Abstract this to generic RouteTab once choose-fee-tab updated
export function HomeTabs({ children }: HomeTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack flexGrow={1} mt="space.05" gap="space.06">
      <Tabs.Root onValueChange={slug => navigate(slug)} defaultValue={location.pathname}>
        <Tabs.List>
          <Tabs.Trigger data-testid="tab-assets" value={RouteUrls.Home}>
            Assets
          </Tabs.Trigger>
          <Tabs.Trigger data-testid="tab-activity" value={`${RouteUrls.Home}${RouteUrls.Activity}`}>
            Activity
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Suspense fallback={<LoadingSpinner pb="72px" />}>
        <Box width="100%">{children}</Box>
      </Suspense>
    </Stack>
  );
}
