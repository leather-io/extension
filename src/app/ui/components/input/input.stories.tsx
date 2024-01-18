import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './input';

const meta: Meta<typeof Input.Root> = {
  component: Input.Root,
  tags: ['autodocs'],
  title: 'Input',
};

export default meta;
type Story = StoryObj<typeof Input.Root>;

export const Default: Story = {
  render: () => (
    <Input.Root>
      <Input.Label>Label</Input.Label>
      <Input.Field type="text" />
    </Input.Root>
  ),
};

export const Error: Story = {
  render: () => (
    <Input.Root data-has-error="true">
      <Input.Label>Error field</Input.Label>
      <Input.Field type="text" />
    </Input.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input.Root>
      <Input.Label>Field is disabled</Input.Label>
      <Input.Field disabled type="text" />
    </Input.Root>
  ),
};

export const DefaultValue: Story = {
  render: () => (
    <Input.Root>
      <Input.Label>Description</Input.Label>
      <Input.Field defaultValue="This is a default value" type="text" />
    </Input.Root>
  ),
};

/**
 * Layout needs to be adjusted in case where there's no label provided
 * An example of this is our Secret Key input form
 */
export const InputNoLabel: Story = {
  render: () => (
    <Input.Root>
      <Input.Field defaultValue="This is a default value" type="text" />
    </Input.Root>
  ),
};

/**
 * When using a placeholder, the label *must* come after the `Input.Field`.
 */
export const WithPlaceholder: Story = {
  render: () => (
    <Input.Root>
      <Input.Field placeholder="Demo placeholder" type="text" />
      <Input.Label>Error field</Input.Label>
    </Input.Root>
  ),
};
