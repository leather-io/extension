import { Suspense } from 'react';

import { Box, Stack, StackProps } from 'leather-styles/jsx';

import { Tabs } from '@leather.io/ui';

import { analytics } from '@shared/utils/analytics';

import { LoadingSpinner } from '@app/components/loading-spinner';

enum CustomFeeTabs {
  Recommended = 'recommended',
  Custom = 'custom',
}

interface ChooseFeeTabsProps extends StackProps {
  customFee: React.JSX.Element;
  defaultToCustomFee: boolean;
  feesList: React.JSX.Element;
}
export function ChooseFeeTabs(props: ChooseFeeTabsProps) {
  const { customFee, defaultToCustomFee, feesList, ...rest } = props;

  return (
    <Stack flexGrow={1} gap="space.04" mt="space.02" width="100%" {...rest}>
      <Tabs.Root
        defaultValue={defaultToCustomFee ? CustomFeeTabs.Custom : CustomFeeTabs.Recommended}
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
