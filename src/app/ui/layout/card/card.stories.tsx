import type { Meta } from '@storybook/react';
import { Box } from 'leather-styles/jsx';

import { Button } from '@leather-wallet/ui';

import { Card as Component } from './card';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/Card',
};

export default meta;

export function Card() {
  return (
    <Component
      footer={
        <Button fullWidth onClick={() => null}>
          Create new account
        </Button>
      }
    >
      <Box height="200px" bg="lightModeRed.300" />
    </Component>
  );
}
