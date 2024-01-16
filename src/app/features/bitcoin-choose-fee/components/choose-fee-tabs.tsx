import { Suspense } from 'react';

import { Box, Stack, StackProps } from 'leather-styles/jsx';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { LoadingSpinner } from '@app/components/loading-spinner';
import { Tabs } from '@app/ui/components/tabs/tabs';

enum CustomFeeTabs {
  Recommended = 'recommended',
  Custom = 'custom',
}

interface ChooseFeeTabsProps extends StackProps {
  customFee: React.JSX.Element;
  feesList: React.JSX.Element;
}
export function ChooseFeeTabs(props: ChooseFeeTabsProps) {
  const { feesList, customFee, ...rest } = props;
  const analytics = useAnalytics();

  return (
    <Stack flexGrow={1} gap="space.04" mt="space.02" width="100%" {...rest}>
      <Tabs.Root
        defaultValue={CustomFeeTabs.Recommended}
        onValueChange={tab => void analytics.page('view', 'custom-fee-tab-' + tab)}
      >
        <Tabs.List>
          <Tabs.Trigger value={CustomFeeTabs.Recommended} data-testid="tab-recommended">
            Recommended
          </Tabs.Trigger>
          <Tabs.Trigger value="custom" data-testid="tab-custom">
            Custom
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value={CustomFeeTabs.Recommended}>
          <Suspense fallback={<LoadingSpinner pb="space.10" />}>
            <Box mt="space.05">{feesList}</Box>
          </Suspense>
        </Tabs.Content>
        <Tabs.Content value={CustomFeeTabs.Custom}>
          <Suspense fallback={<LoadingSpinner pb="72px" />}>
            <Box mt="space.05" width="100%">
              {customFee}
            </Box>
          </Suspense>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
