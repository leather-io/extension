import { Meta } from '@storybook/react';

import { SkeletonLoader as Component } from '@app/ui/components/skeleton-loader/skeleton-loader';

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ['autodocs'],
  title: 'Layout/SkeletonLoader',
};

export default meta;

export function SkeletonLoader() {
  return <Component isLoading width="200px" height="38px" />;
}
