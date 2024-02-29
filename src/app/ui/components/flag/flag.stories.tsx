import { Meta, StoryObj } from '@storybook/react';
import { Box, Circle } from 'leather-styles/jsx';

import { Flag as Component } from './flag';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Flag',
  argTypes: {
    reverse: {
      control: { type: 'boolean' },
      defaultValue: false,
    },
    align: {
      options: ['top', 'middle', 'bottom'],
      control: { type: 'radio' },
      defaultValue: 'middle',
    },
  },
  parameters: {
    controls: { include: ['align', 'reverse'] },
  },
  render: ({ children, ...args }) => (
    <Box maxWidth="360px">
      <Component {...args} img={<Circle size="40px" backgroundColor="ink.border-default" />}>
        {children}
      </Component>
    </Box>
  ),
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Flag: Story = {
  args: {
    children: <Box width="300px" height="20px" backgroundColor="ink.border-default" />,
  },
};
