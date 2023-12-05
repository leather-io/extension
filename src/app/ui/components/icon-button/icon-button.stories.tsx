import type { Meta, StoryObj } from '@storybook/react';

import { PlaceholderIcon, SendIcon } from '@app/ui/icons';

import { IconButton as Component } from './icon-button';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Icon Button',
  parameters: {
    controls: { include: [] },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const IconButton: Story = {
  args: {
    icon: <PlaceholderIcon />,
  },
};

export const WithLabel: Story = {
  args: {
    icon: <SendIcon />,
    label: 'Send',
  },
};
