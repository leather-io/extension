import type { Meta } from '@storybook/react';

import { Header as Component } from './header';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Containers/Header',
};

export default meta;

export function Header() {
  return <Component onClose={() => null} onGoBack={() => null} />;
}
