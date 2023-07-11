import { Suspense, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Flex, SlideFade, Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { RouteUrls } from '@shared/route-urls';

import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

interface ChooseFeeTabsProps extends StackProps {
  children: React.JSX.Element;
}
export function ChooseFeeTabs(props: ChooseFeeTabsProps) {
  const { children, ...rest } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const tabs = useMemo(
    () => [
      { slug: RouteUrls.SendBtcChooseFeeRecommended, label: 'Recommended' },
      { slug: RouteUrls.SendBtcChooseFeeCustom, label: 'Custom' },
    ],
    []
  );

  const getActiveTab = useCallback(
    () => (pathname !== '/' ? tabs.findIndex(tab => tab.slug === pathname) : 0),
    [tabs, pathname]
  );

  // PETE refactor this so it works without state also and with new tabs
  return (
    <Stack flexGrow={1} mt="tight" spacing="base" width="100%" {...rest}>
      <Tabs tabs={tabs} activeTab={getActiveTab()} onTabClick={navigate} />
      <Flex position="relative" flexGrow={1}>
        <Suspense fallback={<LoadingSpinner pb="72px" />}>
          <SlideFade in={true}>
            {styles => (
              <Box width="100%" style={styles}>
                {children}
              </Box>
            )}
          </SlideFade>
        </Suspense>
      </Flex>
    </Stack>
  );
}
