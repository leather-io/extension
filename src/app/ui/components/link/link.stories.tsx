import type { Meta, StoryObj } from '@storybook/react';

import { Link as Component } from './link';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Link',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Link: Story = {
  parameters: {
    controls: { include: ['size', 'variant'] },
  },
  args: {
    children: 'Link',
    size: 'md',
    variant: 'underlined',
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { include: ['size', 'variant'] },
  },
  args: {
    children: 'Link',
    disabled: true,
    size: 'md',
    variant: 'underlined',
  },
};
