import { Suspense, useState } from 'react';

import { Box, Flex, SlideFade, Stack } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/components/tabs';

const analyticsPath = ['/recommended', '/custom'];

interface ChooseFeeTabsProps extends StackProps {
  customFee: React.JSX.Element;
  feesList: React.JSX.Element;
}
export function ChooseFeeTabs(props: ChooseFeeTabsProps) {
  const { feesList, customFee, ...rest } = props;
  const analytics = useAnalytics();
  // TODO #4013: Refactor this to use routes for tabs like home-tabs
  const [activeTab, setActiveTab] = useState(0);

  const setActiveTabTracked = (index: number) => {
    void analytics.page('view', analyticsPath[index]);
    setActiveTab(index);
  };

  return (
    <Stack flexGrow={1} mt="tight" spacing="base" width="100%" {...rest}>
      <Tabs
        tabs={[
          { slug: 'recommended', label: 'Recommended' },
          { slug: 'custom', label: 'Custom' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTabTracked}
      />
      <Flex position="relative" flexGrow={1}>
        {activeTab === 0 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {styles => (
                <Box style={styles} width="100%">
                  {feesList}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <SlideFade in={true}>
              {styles => (
                <Box width="100%" style={styles}>
                  {customFee}
                </Box>
              )}
            </SlideFade>
          </Suspense>
        )}
      </Flex>
    </Stack>
  );
}
