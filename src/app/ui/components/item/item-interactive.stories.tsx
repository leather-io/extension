import { Meta, StoryObj } from '@storybook/react';
import { styled } from 'leather-styles/jsx';

import { BtcAvatarIcon } from '@app/ui/components/avatar/btc-avatar-icon';
import { CopyIcon } from '@app/ui/icons/copy-icon';
import { QrCodeIcon } from '@app/ui/icons/qr-code-icon';

import { Button } from '../button/button';
import { ItemInteractive as Component } from './item-interactive';
import { ItemWithButtonsLayout } from './item-with-buttons.layout';
import { ItemLayout } from './item.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'ItemInteractive',
  parameters: {
    controls: { include: [] },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

function ExampleInteractiveItemContent() {
  return (
    <ItemLayout
      showChevron
      flagImg={<BtcAvatarIcon />}
      titleLeft="Label"
      captionLeft="Caption"
      titleRight="1,000.00 ABC"
      captionRight="$1,000.00"
    />
  );
}

export const ItemInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`InteractiveItem` has its hover state applied with a before pseudo element, so the content aligns independently from its hover state background.',
      },
    },
  },
  args: {
    onClick: () => {},
    children: <ExampleInteractiveItemContent />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    onClick: () => {},
    children: (
      <ItemLayout
        showChevron
        flagImg={<BtcAvatarIcon />}
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
        flagImg={<BtcAvatarIcon />}
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

export const AlignmentExample: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the component alignment in combination with its hover state',
      },
    },
  },
  decorators: [
    Story => (
      <styled.div borderLeft="2px solid" borderColor="red.background-secondary" py="space.06">
        <styled.h1 textStyle="heading.04" mb="space.04">
          Left aligned header
        </styled.h1>
        <Story />
      </styled.div>
    ),
  ],
  args: {
    onClick: () => {},
    children: <ExampleInteractiveItemContent />,
  },
};

export const WithPadding: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In some layouts, it's necessary to contain the bounds of the element's pseudo element hover background. Wrap the component in a div with padding `space.03` to achieve this",
      },
    },
  },
  decorators: [
    Story => (
      <styled.div border="2px solid" borderColor="red.background-secondary" p="space.03">
        <Story />
      </styled.div>
    ),
  ],
  args: {
    onClick: () => {},
    children: <ExampleInteractiveItemContent />,
  },
};
