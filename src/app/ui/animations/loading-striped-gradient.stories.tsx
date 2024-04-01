import { Meta, StoryObj } from '@storybook/react';
import { styled } from 'leather-styles/jsx';

import { loadingStripedGradient } from './loading-striped-gradient';

function LoadingStripedGradient() {
  return <styled.div className={loadingStripedGradient} width="280px" height="20px" />;
}

const meta: Meta<typeof LoadingStripedGradient> = {
  component: LoadingStripedGradient,
  tags: ['autodocs'],
  title: 'Animation/LoadingStripedGradient',
};

export default meta;
type Story = StoryObj<typeof LoadingStripedGradient>;

export const Item: Story = {
  render: () => <LoadingStripedGradient />,
};
