import { Meta, StoryObj } from '@storybook/react';
import { Box, Circle } from 'leather-styles/jsx';

import { ItemLayout as Component } from './item-layout';

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
      img={<Circle size="40px" backgroundColor="red.background-secondary" />}
      titleLeft={<Box width="500px" height="20px" backgroundColor="red.background-secondary" />}
      captionLeft={<Box width="300px" height="20px" backgroundColor="red.background-secondary" />}
      titleRight={<Box width="100px" height="20px" backgroundColor="red.background-secondary" />}
      captionRight={<Box width="200px" height="20px" backgroundColor="red.background-secondary" />}
    />
  ),
};
