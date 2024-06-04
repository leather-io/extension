import { useState } from 'react';

import type { Meta } from '@storybook/react';

import { Button } from '@leather-wallet/ui';

import { Dialog as Component } from './dialog';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Containers/Dialog',
};

export default meta;

export function Dialog() {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <>
      <Button onClick={() => setIsShowing(!isShowing)}>Open</Button>
      <Component
        header={<h1>Some Header</h1>}
        isShowing={isShowing}
        onClose={() => setIsShowing(false)}
      >
        <h1>Some Dialog</h1>
      </Component>
    </>
  );
}
