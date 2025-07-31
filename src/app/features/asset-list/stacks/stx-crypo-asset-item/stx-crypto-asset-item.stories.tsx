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

const symbolStx = 'STX';
const symbolUsd = 'USD';

const stxCryptoAssetBalance = {
  availableBalance: { amount: new BigNumber(100000000000), decimals: 6, symbol: symbolStx },
  availableUnlockedBalance: { amount: new BigNumber(100000000000), decimals: 6, symbol: symbolStx },
  inboundBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
  outboundBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
  pendingBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
  totalBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
  unlockedBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
};

const stxBalanceQuote = {
  availableBalance: { amount: new BigNumber(1000000), decimals: 2, symbol: symbolUsd },
  availableUnlockedBalance: { amount: new BigNumber(1000000), decimals: 2, symbol: symbolUsd },
  inboundBalance: { amount: new BigNumber(0), decimals: 2, symbol: symbolUsd },
  outboundBalance: { amount: new BigNumber(0), decimals: 2, symbol: symbolUsd },
  pendingBalance: { amount: new BigNumber(0), decimals: 2, symbol: symbolUsd },
  totalBalance: { amount: new BigNumber(0), decimals: 2, symbol: symbolUsd },
  unlockedBalance: { amount: new BigNumber(0), decimals: 2, symbol: symbolUsd },
};

const stacksAddress = 'stacks_address';

export const StxCryptoAssetItem: Story = {
  args: {
    balance: {
      address: stacksAddress,
      stx: {
        ...stxCryptoAssetBalance,
        lockedBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolStx },
      },
      quote: {
        ...stxBalanceQuote,
        lockedBalance: { amount: new BigNumber(0), decimals: 6, symbol: symbolUsd },
      },
    },
    isLoading: false,
  },
};

export const StxCryptoAssetItemWithLockedBalance: Story = {
  args: {
    balance: {
      address: stacksAddress,
      stx: {
        ...stxCryptoAssetBalance,
        lockedBalance: { amount: new BigNumber(1000000000), decimals: 6, symbol: symbolStx },
      },
      quote: {
        ...stxBalanceQuote,
        lockedBalance: { amount: new BigNumber(100000), decimals: 2, symbol: symbolUsd },
      },
    },
    isLoading: false,
  },
};

export const StxCryptoAssetItemWithPrivateBalance: Story = {
  args: {
    balance: {
      address: stacksAddress,
      stx: {
        ...stxCryptoAssetBalance,
        lockedBalance: { amount: new BigNumber(1000000000), decimals: 6, symbol: symbolStx },
      },
      quote: {
        ...stxBalanceQuote,
        lockedBalance: { amount: new BigNumber(100000), decimals: 2, symbol: symbolUsd },
      },
    },
    isLoading: false,
    isPrivate: true,
  },
};
