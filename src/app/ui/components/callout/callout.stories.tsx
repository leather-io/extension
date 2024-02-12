import { Meta, StoryObj } from '@storybook/react';

import { Callout as Component } from './callout';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Callout',
  args: {
    variant: 'default',
  },
  parameters: {
    controls: { include: ['variant'] },
  },
  render: args => <Component {...args} width="500px" />,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Callout: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    title: 'Title',
  },
};

export const WithOnlyTitle: Story = {
  args: {
    title: 'Title',
  },
};

export const WithLongTitle: Story = {
  args: {
    title:
      'This is testing a really long title to see how it will look with no caption and two lines for the title',
  },
};

export const WithOnlyCaption: Story = {
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  },
};

export const WithShortCaption: Story = {
  args: {
    children: 'Short caption with no title.',
  },
};
