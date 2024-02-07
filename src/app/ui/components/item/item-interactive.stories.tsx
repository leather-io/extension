import { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button/button';
import { BtcIcon } from '../icons/btc-icon';
import { CopyIcon } from '../icons/copy-icon';
import { QrCodeIcon } from '../icons/qr-code-icon';
import { ItemInteractive as Component } from './item-interactive';
import { ItemWithButtonsLayout } from './item-with-buttons.layout';
import { ItemLayout } from './item.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Item Interactive',
  parameters: {
    controls: { include: [] },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const ItemInteractive: Story = {
  args: {
    onClick: () => {},
    children: (
      <ItemLayout
        showChevron
        flagImg={<BtcIcon />}
        titleLeft="Label"
        captionLeft="Caption"
        titleRight="1,000.00 ABC"
        captionRight="$1,000.00"
      />
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: () => {},
    children: (
      <ItemLayout
        showChevron
        flagImg={<BtcIcon />}
        titleLeft="Label"
        captionLeft="Caption"
        titleRight="1,000.00 ABC"
        captionRight="$1,000.00"
      />
    ),
  },
};

export const WithButtons: Story = {
  args: {
    children: (
      <ItemWithButtonsLayout
        flagImg={<BtcIcon />}
        title="Label"
        caption="Caption"
        buttons={
          <>
            <Button variant="ghost">{<CopyIcon />}</Button>
            <Button variant="ghost">{<QrCodeIcon />}</Button>
          </>
        }
      />
    ),
  },
};
