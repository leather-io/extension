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
      defaultValue: 'top',
    },
  },
  parameters: {
    controls: { include: ['align'] },
  },
  render: ({ children, ...args }) => (
    <Component
      {...args}
      img={<Circle size="52px" backgroundColor="accent.component-background-pressed" />}
    >
      {children}
    </Component>
  ),
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Flag: Story = {
  args: {
    children: (
      <>
        <Box width="120px" height="16px" backgroundColor="accent.component-background-pressed" />
        <Box
          width="80px"
          height="12px"
          mt="space.02"
          backgroundColor="accent.component-background-pressed"
        />
      </>
    ),
  },
};

export const FlagAlternate: Story = {
  args: {
    align: 'middle',
    children: (
      <Box width="120px" height="16px" backgroundColor="accent.component-background-pressed" />
    ),
  },
};
