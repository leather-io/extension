import type { Meta } from '@storybook/react';

import { Dialog as Component, DialogProps } from './dialog';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Design System/Containers/Dialog',
};

export default meta;

//  TODO
// - fix dialog so if you show it with args you can also then close it
// - flesh out stories
export function Dialog(args: DialogProps) {
  return <Component {...args} />;
}
