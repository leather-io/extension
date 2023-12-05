import { Meta, StoryObj } from '@storybook/react';
import { Box, Circle } from 'leather-styles/jsx';

import { Flag as Component } from './flag';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Flag',
  argTypes: {
    align: {
      options: ['top', 'middle', 'bottom'],
      control: { type: 'radio' },
      defaultValue: 'middle',
    },
  },
  parameters: {
    controls: { include: ['align'] },
  },
  render: ({ children, ...args }) => (
    <Component {...args} img={<Circle size="40px" bg="lightModeRed.300" />}>
      {children}
    </Component>
  ),
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Flag: Story = {
  args: {
    children: <Box width="300px" height="20px" bg="lightModeRed.300" />,
  },
};
