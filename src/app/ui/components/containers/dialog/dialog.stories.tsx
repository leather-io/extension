import type { Meta } from '@storybook/react';

import { Dialog as Component, RadixDialogProps } from './dialog';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Containers/Dialog',
};

export default meta;

export function Dialog(args: RadixDialogProps) {
  return <Component {...args} />;
}
