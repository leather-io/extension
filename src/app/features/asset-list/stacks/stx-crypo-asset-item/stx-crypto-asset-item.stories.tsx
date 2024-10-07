import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Meta, StoryObj } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import { queryClient } from '@app/common/persistence';

import { StxCryptoAssetItem as Component } from './stx-crypto-asset-item';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Feature/StxCryptoAssetItem',
  argTypes: {},
  parameters: {},
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Component>;

const symbol = 'STX';

const stxCryptoAssetBalance = {
  availableBalance: { amount: new BigNumber(100000000000), decimals: 6, symbol },
  availableUnlockedBalance: { amount: new BigNumber(100000000000), decimals: 6, symbol },
  inboundBalance: { amount: new BigNumber(0), decimals: 6, symbol },
  outboundBalance: { amount: new BigNumber(0), decimals: 6, symbol },
  pendingBalance: { amount: new BigNumber(0), decimals: 6, symbol },
  totalBalance: { amount: new BigNumber(0), decimals: 6, symbol },
  unlockedBalance: { amount: new BigNumber(0), decimals: 6, symbol },
};

export const StxCryptoAssetItem: Story = {
  args: {
    balance: {
      ...stxCryptoAssetBalance,
      lockedBalance: { amount: new BigNumber(0), decimals: 6, symbol },
    },
    isLoading: false,
  },
};

export const StxCryptoAssetItemWithLockedBalance: Story = {
  args: {
    balance: {
      ...stxCryptoAssetBalance,
      lockedBalance: { amount: new BigNumber(1000000000), decimals: 6, symbol },
    },
    isLoading: false,
    isPrivate: true,
  },
};

export const StxCryptoAssetItemWithPrivateBalance: Story = {
  args: {
    balance: {
      ...stxCryptoAssetBalance,
      lockedBalance: { amount: new BigNumber(1000000000), decimals: 6, symbol },
    },
    isPrivate: true,
    isLoading: false,
  },
};
