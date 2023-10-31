import { Suspense, useState } from 'react';

import { Box, Flex, Stack, StackProps } from 'leather-styles/jsx';

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
    <Stack flexGrow={1} gap="space.04" mt="space.02" width="100%" {...rest}>
      <Tabs
        tabs={[
          { slug: 'recommended', label: 'Recommended' },
          { slug: 'custom', label: 'Custom' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTabTracked}
      />
      <Flex flexGrow={1} position="relative">
        {activeTab === 0 && (
          <Suspense fallback={<LoadingSpinner pb="space.10" />}>
            <Box animation="fadein" transition="transition" width="100%">
              {feesList}
            </Box>
          </Suspense>
        )}
        {activeTab === 1 && (
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <Box animation="fadein" transition="transition" width="100%">
              {customFee}
            </Box>
          </Suspense>
        )}
      </Flex>
    </Stack>
  );
}
