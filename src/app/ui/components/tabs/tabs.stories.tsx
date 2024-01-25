import type { Meta, StoryObj } from '@storybook/react';

import { Tabs as Component } from './tabs';

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Tabs',
};

export default meta;

type Story = StoryObj<typeof Component.Root>;

export const Tabs: Story = {
  render: () => (
    <Component.Root>
      <Component.List>
        <Component.Trigger value="0">Asset</Component.Trigger>
        <Component.Trigger value="1">Activity</Component.Trigger>
      </Component.List>
    </Component.Root>
  ),
};
