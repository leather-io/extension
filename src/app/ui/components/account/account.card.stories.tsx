import type { Meta } from '@storybook/react';
import { Flex } from 'leather-styles/jsx';

import { ActionButton } from '@app/ui/components/account/action-button';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, SwapIcon } from '@app/ui/icons';

import { AccountCard as Component } from './account.card';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Layout/AccountCard',
};

export default meta;

export function AccountCard() {
  return (
    <Component
      name="leather.btc"
      balance="$1,000"
      switchAccount={<></>}
      toggleSwitchAccount={() => null}
    >
      <Flex justify="space-between">
        <ActionButton icon={<ArrowUpIcon />} label="Send" />
        <ActionButton icon={<ArrowDownIcon />} label="Receive" />
        <ActionButton icon={<PlusIcon />} label="Buy" />
        <ActionButton icon={<SwapIcon />} label="Swap" />
      </Flex>
    </Component>
  );
}
