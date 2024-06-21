import { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack } from 'leather-styles/jsx';

import { Tabs } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';

interface HomeTabsProps {
  children: React.ReactNode;
}

export function HomeTabs({ children }: HomeTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack flexGrow={1} mt={{ base: 0, md: 'space.05' }} gap="space.06">
      <Tabs.Root onValueChange={slug => navigate(slug)} defaultValue={location.pathname}>
        <Tabs.List>
          <Tabs.Trigger data-testid="tab-assets" value={RouteUrls.Home}>
            Assets
          </Tabs.Trigger>
          <Tabs.Trigger data-testid="tab-activity" value={RouteUrls.Activity}>
            Activity
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
      <Suspense fallback={<LoadingSpinner pb="72px" />}>
        <Box px={{ base: 'space.05', md: 0 }} width="100%">
          {children}
        </Box>
      </Suspense>
    </Stack>
  );
}
