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

// TODO: Remove invert code
export const InvertLink: Story = {
  parameters: {
    backgrounds: { default: 'leather-dark-mode' },
    controls: { include: [] },
  },
  args: {
    children: 'Link',
    invert: true,
    size: 'md',
    variant: 'underlined',
  },
};
