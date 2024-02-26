import { Meta, StoryObj } from '@storybook/react';
import { Box, Circle } from 'leather-styles/jsx';

import { ItemLayout as Component } from './item.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Item',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Item: Story = {
  render: () => (
    <Component
      flagImg={<Circle size="40px" backgroundColor="lightModeRed.300" />}
      titleLeft={<Box width="500px" height="20px" backgroundColor="lightModeRed.300" />}
      captionLeft={<Box width="300px" height="20px" backgroundColor="lightModeRed.300" />}
      titleRight={<Box width="100px" height="20px" backgroundColor="lightModeRed.300" />}
      captionRight={<Box width="200px" height="20px" backgroundColor="lightModeRed.300" />}
    />
  ),
};
