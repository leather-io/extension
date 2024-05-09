import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Meta, StoryObj } from '@storybook/react';
import BigNumber from 'bignumber.js';

import { StacksBalanceListItemLayout } from './stx-balance-list-item.layout';

const meta: Meta<typeof StacksBalanceListItemLayout> = {
  component: StacksBalanceListItemLayout,
  tags: ['autodocs'],
  title: 'Feature/StxBalanceListItem',
  argTypes: {},
  parameters: {},
  decorators: [
    Story => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StacksBalanceListItemLayout>;

const symbol = 'STX';

export const StacksBalanceItem: Story = {
  args: {
    address: 'ST1PQHQKV0YX2K1Z0V2VQZGZGZGZGZGZGZGZGZGZG',
    stxEffectiveBalance: {
      balance: { decimals: 8, amount: new BigNumber(100000000000), symbol },
      blockchain: 'stacks',
      type: 'crypto-currency',
      asset: {
        decimals: 8,
        hasMemo: true,
        name: 'Stacks',
        symbol,
      } as const,
    },
    stxEffectiveUsdBalance: '$100,000',
  },
};

export const StacksBalanceItemWithLockedBalance: Story = {
  args: {
    address: 'ST1PQHQKV0YX2K1Z0V2VQZGZGZGZGZGZGZGZGZGZG',
    stxEffectiveBalance: {
      balance: { decimals: 8, amount: new BigNumber(100000000000), symbol },
      blockchain: 'stacks',
      type: 'crypto-currency',
      asset: {
        decimals: 8,
        hasMemo: true,
        name: 'Stacks',
        symbol,
      } as const,
    },
    stxEffectiveUsdBalance: '$100,000',
    stxUsdLockedBalance: '$1,000',
    stxLockedBalance: { decimals: 8, amount: new BigNumber(1000000000), symbol },
  },
};
