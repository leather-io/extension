import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'leather-styles/jsx';

import { Callout } from './callout';

const meta: Meta<typeof Callout> = {
  component: Callout,
  tags: ['autodocs'],
  title: 'Callout',
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {
  render: () => (
    <Callout>
      <styled.span>Label</styled.span>
    </Callout>
  ),
};

export const Info: Story = {
  render: () => (
    <Callout variant="info" icon="info">
      <styled.span>Label</styled.span>
    </Callout>
  ),
};

export const Warning: Story = {
  render: () => (
    <Callout variant="warning">
      <styled.span>Label</styled.span>
    </Callout>
  ),
};

export const Error: Story = {
  render: () => (
    <Callout variant="error">
      <styled.span>Label</styled.span>
    </Callout>
  ),
};

export const Success: Story = {
  render: () => (
    <Callout variant="success">
      <styled.span>Label</styled.span>
    </Callout>
  ),
};

export const Neutral: Story = {
  render: () => (
    <Callout variant="neutral">
      <styled.span>Label</styled.span>
    </Callout>
  ),
};
