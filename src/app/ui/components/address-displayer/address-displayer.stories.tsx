import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from 'leather-styles/jsx';

import { Flag } from '@leather-wallet/ui';

import { BtcAvatarIcon } from '../avatar/btc-avatar-icon';
import { StxAvatarIcon } from '../avatar/stx-avatar-icon';
import { AddressDisplayer as Component } from './address-displayer';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'AddressDisplayer',
  parameters: {
    controls: { include: ['address'] },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Bitcoin: Story = {
  args: {
    address: 'bc1pmzfrwwndsqmk5yh69yjr5lfgfg4ev8c0tsc06e',
  },
};

export const Stacks: Story = {
  args: {
    address: 'SP3XKZE32KZ925AAAGWPG1W66YP5BM2RD73T6AJHS',
  },
};

export const WithBTCIcon: Story = {
  args: {
    address: 'bc1pmzfrwwndsqmk5yh69yjr5lfgfg4ev8c0tsc06e',
  },
  render: args => (
    <Flag img={<BtcAvatarIcon />}>
      <Flex flexWrap="wrap" maxWidth="400px">
        <Component address={args.address} />
      </Flex>
    </Flag>
  ),
};

export const WithSTXIcon: Story = {
  args: {
    address: 'SP3XKZE32KZ925AAAGWPG1W66YP5BM2RD73T6AJHS',
  },
  render: args => (
    <Flag img={<StxAvatarIcon />}>
      <Flex flexWrap="wrap" maxWidth="400px">
        <Component address={args.address} />
      </Flex>
    </Flag>
  ),
};
