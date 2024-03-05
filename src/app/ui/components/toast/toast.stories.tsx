import { Meta, StoryObj } from '@storybook/react';
import { styled } from 'leather-styles/jsx';

import { Toast as Component } from './toast';
import { ToastLayout } from './toast.layout';

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Toast',
};

export default meta;
type Story = StoryObj<typeof Component.Root>;

export const Toast: Story = {
  render: () => (
    <Component.Provider duration={1000} label="Toast">
      <styled.div height="100px">
        <Component.Root open>
          <Component.Title>
            <ToastLayout message="Placeholder message" variant="info" />
          </Component.Title>
        </Component.Root>
      </styled.div>
      <Component.Viewport />
    </Component.Provider>
  ),
};

export const WithLongMessage: Story = {
  render: () => (
    <Component.Provider duration={1000} label="Toast">
      <styled.div height="100px">
        <Component.Root open>
          <Component.Title>
            <ToastLayout
              message="Long placeholder message. This is a bizarrely long toast message we should never encounter."
              variant="info"
            />
          </Component.Title>
        </Component.Root>
      </styled.div>
      <Component.Viewport />
    </Component.Provider>
  ),
};

export const AnimatedInfo: Story = {
  render: () => (
    <Component.Provider duration={1000} label="Toast">
      <styled.div height="100px">
        <Component.Root>
          <Component.Title>
            <ToastLayout message="Just a heads up" variant="info" />
          </Component.Title>
        </Component.Root>
      </styled.div>
      <Component.Viewport />
    </Component.Provider>
  ),
};

export const AnimatedSuccess: Story = {
  render: () => (
    <Component.Provider duration={1000} label="Toast">
      <styled.div height="100px">
        <Component.Root>
          <Component.Title>
            <ToastLayout message="That worked well" variant="success" />
          </Component.Title>
        </Component.Root>
      </styled.div>
      <Component.Viewport />
    </Component.Provider>
  ),
};

export const AnimatedError: Story = {
  render: () => (
    <Component.Provider duration={1000} label="Toast">
      <styled.div height="100px">
        <Component.Root>
          <Component.Title>
            <ToastLayout message="Something went wrong" variant="error" />
          </Component.Title>
        </Component.Root>
      </styled.div>
      <Component.Viewport />
    </Component.Provider>
  ),
};
