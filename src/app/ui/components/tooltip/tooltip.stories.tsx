import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from 'leather-styles/jsx';

import { InfoIcon } from '../icons/info-icon';
import { BasicTooltip as Component } from './basic-tooltip';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Tooltip',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Tooltip: Story = {
  args: {
    label: 'Some tooltip',
    side: 'top',
    disabled: false,
  },
  render: args => (
    <RadixTooltip.Provider delayDuration={300}>
      <Component {...args}>
        <Box>
          <InfoIcon color="accent.text-subdued" size="xs" />
        </Box>
      </Component>
    </RadixTooltip.Provider>
  ),
};
