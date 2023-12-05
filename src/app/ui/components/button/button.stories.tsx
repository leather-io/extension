import type { Meta, StoryObj } from '@storybook/react';
import { HStack, styled } from 'leather-styles/jsx';

import { BtcIcon } from '@app/ui/components/avatar-icon/btc-icon';
import { ChevronDownIcon } from '@app/ui/icons/chevron-down-icon';
import { PlaceholderIcon } from '@app/ui/icons/placeholder-icon';

// TODO - fix this, my branch is missing a lot of variants and I thin kthats whays up with bottons
import { Button as Component } from './button';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Button',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Button: Story = {
  parameters: {
    controls: { include: ['size', 'variant'] },
  },
  args: {
    children: 'Button',
    size: 'md',
    variant: 'solid',
  },
};

export const Disabled: Story = {
  parameters: {
    controls: { include: ['size', 'variant'] },
  },
  args: {
    disabled: true,
    children: 'Button',
    size: 'md',
    variant: 'solid',
  },
};

export const WithIcons: Story = {
  parameters: {
    controls: { include: ['size', 'variant'] },
  },
  args: {
    children: (
      <HStack gap={Button.args?.size === 'md' ? 'space.02' : 'space.01'}>
        <PlaceholderIcon />
        <styled.span textStyle="label.02">Button</styled.span>
        <PlaceholderIcon />
      </HStack>
    ),
    size: 'md',
    variant: 'solid',
  },
};

export const WithToken: Story = {
  parameters: {
    controls: { include: [] },
  },
  args: {
    children: (
      <HStack>
        <BtcIcon />
        <styled.span textStyle="label.01">Button</styled.span>
        <ChevronDownIcon variant="small" />
      </HStack>
    ),
    trigger: true,
    variant: 'ghost',
  },
};
