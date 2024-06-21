import type { Meta } from '@storybook/react';
import { Box, Flex, Stack } from 'leather-styles/jsx';

import { ArrowDownIcon, ArrowUpIcon, IconButton, PlusIcon, SwapIcon, Tabs } from '@leather.io/ui';

import { RouteUrls } from '@shared/route-urls';

import { HomeLayout as Component } from './home.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Pages/Home',
};

export default meta;

export function HomeLayout() {
  return (
    <Component
      accountCard={
        // TODO don't repeat this, compose story
        <Flex justify="space-between">
          <IconButton icon={<ArrowUpIcon />} label="Send" />
          <IconButton icon={<ArrowDownIcon />} label="Receive" />
          <IconButton icon={<PlusIcon />} label="Buy" />
          <IconButton icon={<SwapIcon />} label="Swap" />
        </Flex>
      }
    >
      <Stack flexGrow={1} mt="space.05" gap="space.06">
        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger data-testid="tab-assets" value={RouteUrls.Home}>
              Assets
            </Tabs.Trigger>
            <Tabs.Trigger
              data-testid="tab-activity"
              value={`${RouteUrls.Home}${RouteUrls.Activity}`}
            >
              Activity
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Box width="100%" height="400px" bg="lightModeRed.300" />
      </Stack>
    </Component>
  );
}
