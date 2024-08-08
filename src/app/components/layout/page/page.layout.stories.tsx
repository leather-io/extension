import type { Meta } from '@storybook/react';

import { Card } from '@app/components/layout/card/card.stories';

import { Page as Component } from './page.layout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Page',
};

export default meta;

export function Page() {
  return (
    <Component>
      <Card />
    </Component>
  );
}
