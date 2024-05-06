import type { Meta, StoryObj } from '@storybook/react';
import { Box, styled } from 'leather-styles/jsx';

import { Accordion as Component } from './accordion';

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Accordion',
};

export default meta;

type Story = StoryObj<typeof Component.Root>;

export const Accordion: Story = {
  render: () => (
    <Box width="300px">
      <Component.Root type="single" collapsible>
        <Component.Item value="item-1">
          <Component.Trigger>
            <styled.span>View more</styled.span>
          </Component.Trigger>
          <Component.Content>
            <styled.div>Content</styled.div>
          </Component.Content>
        </Component.Item>
      </Component.Root>
    </Box>
  ),
};
