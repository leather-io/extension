import { Meta, StoryObj } from '@storybook/react';

import { Caption } from '../typography/caption';
import { Title } from '../typography/title';
import { BulletSeparator as Component } from './bullet-separator';

/**
 * Note that the BulletSeparator component doesn't bring it's own margins, these
 * should be appiled separately
 */
const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'BulletSeparator',
};

export default meta;
type Story = StoryObj<typeof Component>;

export const BulletSeparator: Story = {
  render: () => (
    <Component>
      <span style={{ margin: '0 8px' }}>Item 1</span>
      <span style={{ margin: '0 8px' }}>Item 2</span>
      <span style={{ margin: '0 8px' }}>Item 3</span>
    </Component>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Caption>
      <Component>
        <span style={{ margin: '0 6px' }}>Item 1</span>
        <span style={{ margin: '0 6px' }}>Item 2</span>
        <span style={{ margin: '0 6px' }}>Item 3</span>
      </Component>
    </Caption>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Title>
      <Component>
        <span style={{ margin: '0 6px' }}>Item 1</span>
        <span style={{ margin: '0 6px' }}>Item 2</span>
        <span style={{ margin: '0 6px' }}>Item 3</span>
      </Component>
    </Title>
  ),
};
